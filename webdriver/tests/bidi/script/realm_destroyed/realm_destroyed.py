import pytest
from webdriver.error import TimeoutException

from tests.bidi import wait_for_bidi_events
from ..realm_created.realm_created import REALM_CREATED_EVENT
from .. import create_sandbox


pytestmark = pytest.mark.asyncio

REALM_DESTROYED_EVENT = "script.realmDestroyed"


async def test_unsubscribe(bidi_session):
    new_context = await bidi_session.browsing_context.create(type_hint="tab")
    await bidi_session.session.subscribe(events=[REALM_DESTROYED_EVENT])
    await bidi_session.session.unsubscribe(events=[REALM_DESTROYED_EVENT])

    events = []

    async def on_event(method, data):
        events.append(data)

    remove_listener = bidi_session.add_event_listener(REALM_DESTROYED_EVENT, on_event)

    await bidi_session.browsing_context.close(context=new_context["context"])

    assert len(events) == 0

    remove_listener()


@pytest.mark.parametrize("type_hint", ["window", "tab"])
async def test_close_context(bidi_session, subscribe_events, wait_for_event, wait_for_future_safe, type_hint):
    new_context = await bidi_session.browsing_context.create(type_hint=type_hint)
    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    result = await bidi_session.script.get_realms(context=new_context["context"])

    on_realm_destroyed = wait_for_event(REALM_DESTROYED_EVENT)

    await bidi_session.browsing_context.close(context=new_context["context"])

    event = await wait_for_future_safe(on_realm_destroyed)

    assert event == {"realm": result[0]["realm"]}


async def test_navigate(
    bidi_session, subscribe_events, wait_for_event, wait_for_future_safe, inline, new_tab
):
    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    result = await bidi_session.script.get_realms(context=new_tab["context"])

    on_realm_destroyed = wait_for_event(REALM_DESTROYED_EVENT)

    await bidi_session.browsing_context.navigate(
        context=new_tab["context"], url=inline("<div>foo</div>"), wait="complete"
    )

    event = await wait_for_future_safe(on_realm_destroyed)

    assert event == {"realm": result[0]["realm"]}


async def test_reload_context(
    bidi_session, subscribe_events, wait_for_event, wait_for_future_safe, top_context
):
    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    result = await bidi_session.script.get_realms(context=top_context["context"])

    on_realm_destroyed = wait_for_event(REALM_DESTROYED_EVENT)

    await bidi_session.browsing_context.reload(context=top_context["context"])

    event = await wait_for_future_safe(on_realm_destroyed)

    assert event == {"realm": result[0]["realm"]}


@pytest.mark.parametrize("method", ["evaluate", "call_function"])
async def test_sandbox(bidi_session, subscribe_events, new_tab, method):
    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    # Track all received script.realmDestroyed events in the destroyed_realm_ids array
    destroyed_realm_ids = []

    async def on_event(method, data):
        destroyed_realm_ids.append(data["realm"])

    remove_listener = bidi_session.add_event_listener(REALM_DESTROYED_EVENT, on_event)

    sandbox_realm = await create_sandbox(
        bidi_session, new_tab["context"], "test", method
    )

    await bidi_session.browsing_context.close(context=new_tab["context"])

    await wait_for_bidi_events(bidi_session, destroyed_realm_ids, 2)

    assert sandbox_realm in destroyed_realm_ids

    remove_listener()


async def test_subscribe_after_sandbox_creation(
    bidi_session, subscribe_events, new_tab, inline
):
    sandbox_realm = await create_sandbox(bidi_session, new_tab["context"])

    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    # Track all received script.realmDestroyed events in the destroyed_realm_ids array
    destroyed_realm_ids = []

    async def on_event(method, data):
        if data["realm"] == sandbox_realm:
            destroyed_realm_ids.append(data["realm"])

    remove_listener = bidi_session.add_event_listener(REALM_DESTROYED_EVENT, on_event)

    await bidi_session.browsing_context.navigate(
        context=new_tab["context"], url=inline("<div>foo</div>"), wait="complete"
    )

    await wait_for_bidi_events(bidi_session, destroyed_realm_ids, 1)

    remove_listener()


@pytest.mark.parametrize("domain", ["", "alt"], ids=["same_origin", "cross_origin"])
async def test_iframe(
    bidi_session, subscribe_events, top_context, inline, wait_for_event, wait_for_future_safe, domain
):
    frame_url = inline("<div>foo</div>")
    url = inline(f"<iframe src='{frame_url}'></iframe>", domain=domain)
    await bidi_session.browsing_context.navigate(
        url=url, context=top_context["context"], wait="complete"
    )

    contexts = await bidi_session.browsing_context.get_tree(root=top_context["context"])

    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    on_realm_destroyed = wait_for_event(REALM_DESTROYED_EVENT)

    frame_context = contexts[0]["children"][0]["context"]
    result = await bidi_session.script.get_realms(context=frame_context)

    await bidi_session.browsing_context.navigate(
        context=frame_context, url=inline("<div>foo</div>"), wait="complete"
    )

    event = await wait_for_future_safe(on_realm_destroyed)

    assert event == {"realm": result[0]["realm"]}


async def test_iframe_destroy_parent(
    bidi_session, subscribe_events, test_page_same_origin_frame, new_tab
):
    await bidi_session.browsing_context.navigate(
        url=test_page_same_origin_frame, context=new_tab["context"], wait="complete"
    )

    contexts = await bidi_session.browsing_context.get_tree(root=new_tab["context"])

    await subscribe_events(events=[REALM_DESTROYED_EVENT])

    # Track all received script.realmDestroyed events in the destroyed_realm_ids array
    destroyed_realm_ids = []

    async def on_event(method, data):
        destroyed_realm_ids.append(data["realm"])

    remove_listener = bidi_session.add_event_listener(REALM_DESTROYED_EVENT, on_event)

    realm_for_iframe = await bidi_session.script.get_realms(
        context=contexts[0]["children"][0]["context"]
    )
    realm_for_parent = await bidi_session.script.get_realms(context=new_tab["context"])

    await bidi_session.browsing_context.close(context=new_tab["context"])

    await wait_for_bidi_events(bidi_session, destroyed_realm_ids, 2)

    assert realm_for_iframe[0]["realm"] in destroyed_realm_ids
    assert realm_for_parent[0]["realm"] in destroyed_realm_ids

    remove_listener()


async def test_subscribe_to_one_context(
    bidi_session, subscribe_events, new_tab, inline, top_context
):
    await bidi_session.browsing_context.navigate(
        context=new_tab["context"], url=inline("<div>foo</div>"), wait="complete"
    )

    # Subscribe to a specific context
    await subscribe_events(
        events=[REALM_DESTROYED_EVENT], contexts=[new_tab["context"]]
    )

    # Track all received script.realmDestroyed events in the destroyed_realm_ids array
    destroyed_realm_ids = []

    async def on_event(method, data):
        destroyed_realm_ids.append(data["realm"])

    remove_listener = bidi_session.add_event_listener(REALM_DESTROYED_EVENT, on_event)

    await bidi_session.browsing_context.navigate(
        context=top_context["context"], url=inline("<div>foo</div>"), wait="complete"
    )

    # Make sure we didn't receive the event for the top context
    with pytest.raises(TimeoutException):
        await wait_for_bidi_events(bidi_session, destroyed_realm_ids, 1, timeout=0.5)

    result = await bidi_session.script.get_realms(context=new_tab["context"])

    await bidi_session.browsing_context.navigate(
        context=new_tab["context"], url=inline("<div>foo</div>"), wait="complete"
    )

    await wait_for_bidi_events(bidi_session, destroyed_realm_ids, 1)

    assert result[0]["realm"] in destroyed_realm_ids

    remove_listener()


async def test_dedicated_worker(
    wait_for_future_safe,
    bidi_session,
    subscribe_events,
    top_context,
    inline,
    event_loop,
):
    await subscribe_events(events=[REALM_CREATED_EVENT, REALM_DESTROYED_EVENT])

    found = event_loop.create_future()
    worker_realm = event_loop.create_future()

    async def on_realm_created_event(method, data):
        if data["type"] == "dedicated-worker":
            if worker_realm.done():
                raise "More than one dedicated worker"
            else:
                worker_realm.set_result(data)

    async def on_realm_destroyed_event(method, data):
        if worker_realm.done() and data["realm"] == worker_realm.result()["realm"]:
            found.set_result(True)

    remove_realm_created_listener = bidi_session.add_event_listener(
        REALM_CREATED_EVENT, on_realm_created_event
    )
    remove_realm_destroyed_listener = bidi_session.add_event_listener(
        REALM_DESTROYED_EVENT, on_realm_destroyed_event
    )

    worker_url = inline("while(true){}", doctype="js")
    url = inline(
        f"""<script>
        const worker = new Worker('{worker_url}');
        setTimeout(() => {{
            worker.terminate();
        }}, 100);
    </script>"""
    )
    await bidi_session.browsing_context.navigate(
        url=url, context=top_context["context"], wait="complete"
    )

    assert await wait_for_future_safe(found)
    remove_realm_created_listener()
    remove_realm_destroyed_listener()


async def test_shared_worker(
    wait_for_future_safe,
    bidi_session,
    subscribe_events,
    top_context,
    inline,
    event_loop,
):
    await subscribe_events(events=[REALM_CREATED_EVENT, REALM_DESTROYED_EVENT])

    found = event_loop.create_future()
    worker_realm = event_loop.create_future()

    async def on_realm_created_event(method, data):
        if data["type"] == "shared-worker":
            if worker_realm.done():
                raise "More than one dedicated worker"
            else:
                worker_realm.set_result(data)

    async def on_realm_destroyed_event(method, data):
        if worker_realm.done() and data["realm"] == worker_realm.result()["realm"]:
            found.set_result(True)

    remove_realm_created_listener = bidi_session.add_event_listener(
        REALM_CREATED_EVENT, on_realm_created_event
    )
    remove_realm_destroyed_listener = bidi_session.add_event_listener(
        REALM_DESTROYED_EVENT, on_realm_destroyed_event
    )

    worker_url = inline("while(true){}", doctype="js")
    url = inline(
        f"""<script>
        const worker = new SharedWorker('{worker_url}');
    </script>"""
    )
    await bidi_session.browsing_context.navigate(
        url=url, context=top_context["context"], wait="complete"
    )
    # Wait for the worker realm before navigating to ensure we aren't navigating
    # too early.
    assert await wait_for_future_safe(worker_realm)

    url = inline("")
    await bidi_session.browsing_context.navigate(
        url=url, context=top_context["context"], wait="complete"
    )
    assert await wait_for_future_safe(found)

    remove_realm_created_listener()
    remove_realm_destroyed_listener()
