// META: title=test WebNN API instanceNormalization operation
// META: global=window,dedicatedworker
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=../resources/utils.js
// META: timeout=long

'use strict';

// https://www.w3.org/TR/webnn/#api-mlgraphbuilder-instancenorm
// Normalize the input using Instance-Normalization.
//
// dictionary MLInstanceNormalizationOptions {
//   MLOperand scale;
//   MLOperand bias;
//   double epsilon = 1e-5;
//   MLInputOperandLayout layout = "nchw";
// };
//
// MLOperand instanceNormalization(
//     MLOperand input, optional MLInstanceNormalizationOptions options = {});


const getInstanceNormPrecisionTolerance = (graphResources) => {
  // according to
  // https://github.com/web-platform-tests/wpt/pull/43891#discussion_r1457026316
  const toleranceValueDict = {float32: 840, float16: 8400};
  const expectedDataType =
      getExpectedDataTypeOfSingleOutput(graphResources.expectedOutputs);
  return {metricType: 'ULP', value: toleranceValueDict[expectedDataType]};
};

const instanceNormTests = [
  {
    'name': 'instanceNormalization float32 4D tensor default options',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,    29.44037628173828,  -73.92131042480469,
            -38.11185836791992,  41.33772659301758,  -59.77853012084961,
            -74.66901397705078,  -68.16508483886719, 35.82481384277344,
            -6.948329448699951,  54.42462158203125,  47.53074645996094,
            66.93562316894531,   76.74034881591797,  5.6758809089660645,
            25.68659210205078,   37.37651062011719,  56.252689361572266,
            -16.574905395507812, 42.949893951416016, 73.8739242553711,
            -99.00035095214844,  -33.11322784423828, -17.380685806274414
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments': [{'input': 'instanceNormInput'}],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            -1.0995290279388428, 1.5525832176208496,  -0.5992818474769592,
            0.14622758328914642, 1.72129487991333,    -0.41020718216896057,
            -0.7240943908691406, -0.586993396282196,  0.13073226809501648,
            -1.6633318662643433, 0.9108771681785583,  0.6217224597930908,
            0.7947131395339966,  1.1309205293655396,  -1.3059037923812866,
            -0.6197298169136047, 0.2657700479030609,  0.9459608793258667,
            -1.6783342361450195, 0.46660327911376953, 1.5037200450897217,
            -1.2981476783752441, -0.2302791178226471, 0.024706769734621048
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'instanceNormalization float32 4D tensor options.scale',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,    29.44037628173828,  -73.92131042480469,
            -38.11185836791992,  41.33772659301758,  -59.77853012084961,
            -74.66901397705078,  -68.16508483886719, 35.82481384277344,
            -6.948329448699951,  54.42462158203125,  47.53074645996094,
            66.93562316894531,   76.74034881591797,  5.6758809089660645,
            25.68659210205078,   37.37651062011719,  56.252689361572266,
            -16.574905395507812, 42.949893951416016, 73.8739242553711,
            -99.00035095214844,  -33.11322784423828, -17.380685806274414
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        },
        'instanceNormScale': {
          'data': [-94.42772674560547, 66.69620513916016, -98.56572723388672],
          'descriptor': {shape: [3], dataType: 'float32'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments': [
          {'input': 'instanceNormInput'},
          {'options': {'scale': 'instanceNormScale'}}
        ],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            103.8260269165039,   -146.60690307617188, 56.58882141113281,
            -13.807937622070312, 114.80384063720703,  -27.359262466430664,
            -48.29434585571289,  -39.150230407714844, -12.885721206665039,
            163.94752502441406,  -89.78126525878906,  -61.2805290222168,
            -75.04296112060547,  -106.79025268554688, 123.31352996826172,
            58.51968002319336,   17.725852966308594,  63.09199905395508,
            -111.93852233886719, 31.120668411254883,  -148.2152557373047,
            127.95286560058594,  22.697628021240234,  -2.4352407455444336
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'instanceNormalization float32 4D tensor options.bias',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,    29.44037628173828,  -73.92131042480469,
            -38.11185836791992,  41.33772659301758,  -59.77853012084961,
            -74.66901397705078,  -68.16508483886719, 35.82481384277344,
            -6.948329448699951,  54.42462158203125,  47.53074645996094,
            66.93562316894531,   76.74034881591797,  5.6758809089660645,
            25.68659210205078,   37.37651062011719,  56.252689361572266,
            -16.574905395507812, 42.949893951416016, 73.8739242553711,
            -99.00035095214844,  -33.11322784423828, -17.380685806274414
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        },
        'instanceNormBias': {
          'data': [-33.048641204833984, 4.511423587799072, -37.93617248535156],
          'descriptor': {shape: [3], dataType: 'float32'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments': [
          {'input': 'instanceNormInput'},
          {'options': {'bias': 'instanceNormBias'}}
        ],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            -34.148170471191406, -31.496057510375977, -33.64792251586914,
            -32.90241241455078,  6.232718467712402,   4.1012163162231445,
            3.7873291969299316,  3.9244301319122314,  -37.80543899536133,
            -39.59950256347656,  -37.02529525756836,  -37.314449310302734,
            -32.253929138183594, -31.917720794677734, -34.35454559326172,
            -33.66836929321289,  4.777193546295166,   5.4573845863342285,
            2.8330893516540527,  4.978026866912842,   -36.43245315551758,
            -39.23432159423828,  -38.16645050048828,  -37.91146469116211
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'instanceNormalization float32 4D tensor options.epsilon',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,    29.44037628173828,  -73.92131042480469,
            -38.11185836791992,  41.33772659301758,  -59.77853012084961,
            -74.66901397705078,  -68.16508483886719, 35.82481384277344,
            -6.948329448699951,  54.42462158203125,  47.53074645996094,
            66.93562316894531,   76.74034881591797,  5.6758809089660645,
            25.68659210205078,   37.37651062011719,  56.252689361572266,
            -16.574905395507812, 42.949893951416016, 73.8739242553711,
            -99.00035095214844,  -33.11322784423828, -17.380685806274414
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments': [
          {'input': 'instanceNormInput'}, {'options': {'epsilon': 0.000001}}
        ],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            -1.0995290279388428, 1.5525832176208496,  -0.5992818474769592,
            0.14622758328914642, 1.72129487991333,    -0.41020718216896057,
            -0.7240943908691406, -0.586993396282196,  0.13073226809501648,
            -1.6633318662643433, 0.9108771681785583,  0.6217224597930908,
            0.7947131991386414,  1.1309205293655396,  -1.3059037923812866,
            -0.6197298765182495, 0.2657700479030609,  0.9459608793258667,
            -1.6783342361450195, 0.46660327911376953, 1.5037200450897217,
            -1.2981476783752441, -0.2302791178226471, 0.024706769734621048
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name':
        'instanceNormalization float32 4D tensor explict options.layout=\'nchw\'',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,    29.44037628173828,  -73.92131042480469,
            -38.11185836791992,  41.33772659301758,  -59.77853012084961,
            -74.66901397705078,  -68.16508483886719, 35.82481384277344,
            -6.948329448699951,  54.42462158203125,  47.53074645996094,
            66.93562316894531,   76.74034881591797,  5.6758809089660645,
            25.68659210205078,   37.37651062011719,  56.252689361572266,
            -16.574905395507812, 42.949893951416016, 73.8739242553711,
            -99.00035095214844,  -33.11322784423828, -17.380685806274414
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments':
            [{'input': 'instanceNormInput'}, {'options': {'layout': 'nchw'}}],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            -1.0995290279388428, 1.5525832176208496,  -0.5992818474769592,
            0.14622758328914642, 1.72129487991333,    -0.41020718216896057,
            -0.7240943908691406, -0.586993396282196,  0.13073226809501648,
            -1.6633318662643433, 0.9108771681785583,  0.6217224597930908,
            0.7947131395339966,  1.1309205293655396,  -1.3059037923812866,
            -0.6197298169136047, 0.2657700479030609,  0.9459608793258667,
            -1.6783342361450195, 0.46660327911376953, 1.5037200450897217,
            -1.2981476783752441, -0.2302791178226471, 0.024706769734621048
          ],
          'descriptor': {shape: [2, 3, 2, 2], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'instanceNormalization float32 4D tensor options.layout=\'nhwc\'',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,   41.33772659301758,   35.82481384277344,
            29.44037628173828,  -59.77853012084961,  -6.948329448699951,
            -73.92131042480469, -74.66901397705078,  54.42462158203125,
            -38.11185836791992, -68.16508483886719,  47.53074645996094,
            66.93562316894531,  37.37651062011719,   73.8739242553711,
            76.74034881591797,  56.252689361572266,  -99.00035095214844,
            5.6758809089660645, -16.574905395507812, -33.11322784423828,
            25.68659210205078,  42.949893951416016,  -17.380685806274414
          ],
          'descriptor': {shape: [2, 2, 2, 3], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments':
            [{'input': 'instanceNormInput'}, {'options': {'layout': 'nhwc'}}],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            -1.0995290279388428, 1.72129487991333,     0.13073226809501648,
            1.5525832176208496,  -0.41020718216896057, -1.6633318662643433,
            -0.5992818474769592, -0.7240943908691406,  0.9108771681785583,
            0.14622758328914642, -0.586993396282196,   0.6217224597930908,
            0.7947131395339966,  0.2657700479030609,   1.5037200450897217,
            1.1309205293655396,  0.9459608793258667,   -1.2981476783752441,
            -1.3059037923812866, -1.6783342361450195,  -0.2302791178226471,
            -0.6197298169136047, 0.46660327911376953,  0.024706769734621048
          ],
          'descriptor': {shape: [2, 2, 2, 3], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'instanceNormalization float32 4D tensor all options',
    'graph': {
      'inputs': {
        'instanceNormInput': {
          'data': [
            -97.949951171875,   41.33772659301758,   35.82481384277344,
            29.44037628173828,  -59.77853012084961,  -6.948329448699951,
            -73.92131042480469, -74.66901397705078,  54.42462158203125,
            -38.11185836791992, -68.16508483886719,  47.53074645996094,
            66.93562316894531,  37.37651062011719,   73.8739242553711,
            76.74034881591797,  56.252689361572266,  -99.00035095214844,
            5.6758809089660645, -16.574905395507812, -33.11322784423828,
            25.68659210205078,  42.949893951416016,  -17.380685806274414
          ],
          'descriptor': {shape: [2, 2, 2, 3], dataType: 'float32'}
        },
        'instanceNormScale': {
          'data': [-94.42772674560547, 66.69620513916016, -98.56572723388672],
          'descriptor': {shape: [3], dataType: 'float32'},
          'constant': true
        },
        'instanceNormBias': {
          'data': [-33.048641204833984, 4.511423587799072, -37.93617248535156],
          'descriptor': {shape: [3], dataType: 'float32'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'instanceNormalization',
        'arguments': [
          {'input': 'instanceNormInput'}, {
            'options': {
              'scale': 'instanceNormScale',
              'bias': 'instanceNormBias',
              'epsilon': 0.000001,
              'layout': 'nhwc'
            }
          }
        ],
        'outputs': 'instanceNormOutput'
      }],
      'expectedOutputs': {
        'instanceNormOutput': {
          'data': [
            70.77738189697266,   119.31526184082031,  -50.821895599365234,
            -179.65554809570312, -22.847837448120117, 126.01134490966797,
            23.540178298950195,  -43.782920837402344, -127.71744537353516,
            -46.8565788269043,   -34.6388053894043,   -99.2166976928711,
            -108.09159851074219, 22.237276077270508,  -186.15142822265625,
            -139.83889770507812, 67.60342407226562,   90.01669311523438,
            90.26488494873047,   -107.4271011352539,  -15.238543510437012,
            25.471038818359375,  35.6320915222168,    -40.37141418457031
          ],
          'descriptor': {shape: [2, 2, 2, 3], dataType: 'float32'}
        }
      }
    }
  }
];

if (navigator.ml) {
  instanceNormTests.forEach((test) => {
    webnn_conformance_test(
        buildAndExecuteGraph, getInstanceNormPrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
