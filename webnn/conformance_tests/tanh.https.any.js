// META: title=test WebNN API tanh operation
// META: global=window,dedicatedworker
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=../resources/utils.js
// META: timeout=long

'use strict';

// https://www.w3.org/TR/webnn/#api-mlgraphbuilder-tanh-method
// Compute the hyperbolic tangent function of the input tensor. The calculation
// follows the expression (exp(2 * x) - 1) / (exp(2 * x) + 1).
//
// MLOperand tanh(MLOperand input);

const getTanhPrecisionTolerance = (graphResources) => {
  const toleranceValueDict = {float32: 1 / 1024, float16: 1 / 512};
  const expectedDataType =
      getExpectedDataTypeOfSingleOutput(graphResources.expectedOutputs);
  return {metricType: 'ATOL', value: toleranceValueDict[expectedDataType]};
};

const tanhTests = [
  {
    'name': 'tanh float32 1D constant tensor',
    'graph': {
      'inputs': {
        'tanhInput': {
          'data': [
            5.473527431488037,   -1.1535595655441284,  0.4074455797672272,
            1.8297704458236694,  2.869000196456909,    -4.570195198059082,
            4.146744251251221,   -4.065934181213379,   -3.7128469944000244,
            0.9077175259590149,  -0.11083049327135086, 5.955096244812012,
            1.7831857204437256,  4.023128509521484,    5.587857723236084,
            -5.280653953552246,  1.4147950410842896,   -5.707716941833496,
            -1.443918228149414,  -1.9129083156585693,  2.7495968341827393,
            -0.7420240044593811, 4.856568336486816,    -0.7563357949256897
          ],
          'descriptor': {shape: [24], dataType: 'float32'},
          'constant': true
        }
      },
      'operators': [{
        'name': 'tanh',
        'arguments': [{'input': 'tanhInput'}],
        'outputs': 'tanhOutput'
      }],
      'expectedOutputs': {
        'tanhOutput': {
          'data': [
            0.9999647736549377,  -0.8189298510551453, 0.38630160689353943,
            0.9498035907745361,  0.9935782551765442,  -0.9997855424880981,
            0.9994998574256897,  -0.9994121193885803, -0.9988092184066772,
            0.7200349569320679,  -0.1103789210319519, 0.9999865293502808,
            0.945036768913269,   0.9993596076965332,  0.9999719858169556,
            -0.9999482035636902, 0.8885080814361572,  -0.9999779462814331,
            -0.894483745098114,  -0.9573289752006531, 0.9918531775474548,
            -0.6303664445877075, 0.9998790621757507,  -0.6389135718345642
          ],
          'descriptor': {shape: [24], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'tanh float32 1D tensor',
    'graph': {
      'inputs': {
        'tanhInput': {
          'data': [
            5.473527431488037,   -1.1535595655441284,  0.4074455797672272,
            1.8297704458236694,  2.869000196456909,    -4.570195198059082,
            4.146744251251221,   -4.065934181213379,   -3.7128469944000244,
            0.9077175259590149,  -0.11083049327135086, 5.955096244812012,
            1.7831857204437256,  4.023128509521484,    5.587857723236084,
            -5.280653953552246,  1.4147950410842896,   -5.707716941833496,
            -1.443918228149414,  -1.9129083156585693,  2.7495968341827393,
            -0.7420240044593811, 4.856568336486816,    -0.7563357949256897
          ],
          'descriptor': {shape: [24], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'tanh',
        'arguments': [{'input': 'tanhInput'}],
        'outputs': 'tanhOutput'
      }],
      'expectedOutputs': {
        'tanhOutput': {
          'data': [
            0.9999647736549377,  -0.8189298510551453, 0.38630160689353943,
            0.9498035907745361,  0.9935782551765442,  -0.9997855424880981,
            0.9994998574256897,  -0.9994121193885803, -0.9988092184066772,
            0.7200349569320679,  -0.1103789210319519, 0.9999865293502808,
            0.945036768913269,   0.9993596076965332,  0.9999719858169556,
            -0.9999482035636902, 0.8885080814361572,  -0.9999779462814331,
            -0.894483745098114,  -0.9573289752006531, 0.9918531775474548,
            -0.6303664445877075, 0.9998790621757507,  -0.6389135718345642
          ],
          'descriptor': {shape: [24], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'tanh float32 2D tensor',
    'graph': {
      'inputs': {
        'tanhInput': {
          'data': [
            5.473527431488037,   -1.1535595655441284,  0.4074455797672272,
            1.8297704458236694,  2.869000196456909,    -4.570195198059082,
            4.146744251251221,   -4.065934181213379,   -3.7128469944000244,
            0.9077175259590149,  -0.11083049327135086, 5.955096244812012,
            1.7831857204437256,  4.023128509521484,    5.587857723236084,
            -5.280653953552246,  1.4147950410842896,   -5.707716941833496,
            -1.443918228149414,  -1.9129083156585693,  2.7495968341827393,
            -0.7420240044593811, 4.856568336486816,    -0.7563357949256897
          ],
          'descriptor': {shape: [4, 6], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'tanh',
        'arguments': [{'input': 'tanhInput'}],
        'outputs': 'tanhOutput'
      }],
      'expectedOutputs': {
        'tanhOutput': {
          'data': [
            0.9999647736549377,  -0.8189298510551453, 0.38630160689353943,
            0.9498035907745361,  0.9935782551765442,  -0.9997855424880981,
            0.9994998574256897,  -0.9994121193885803, -0.9988092184066772,
            0.7200349569320679,  -0.1103789210319519, 0.9999865293502808,
            0.945036768913269,   0.9993596076965332,  0.9999719858169556,
            -0.9999482035636902, 0.8885080814361572,  -0.9999779462814331,
            -0.894483745098114,  -0.9573289752006531, 0.9918531775474548,
            -0.6303664445877075, 0.9998790621757507,  -0.6389135718345642
          ],
          'descriptor': {shape: [4, 6], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'tanh float32 3D tensor',
    'graph': {
      'inputs': {
        'tanhInput': {
          'data': [
            5.473527431488037,   -1.1535595655441284,  0.4074455797672272,
            1.8297704458236694,  2.869000196456909,    -4.570195198059082,
            4.146744251251221,   -4.065934181213379,   -3.7128469944000244,
            0.9077175259590149,  -0.11083049327135086, 5.955096244812012,
            1.7831857204437256,  4.023128509521484,    5.587857723236084,
            -5.280653953552246,  1.4147950410842896,   -5.707716941833496,
            -1.443918228149414,  -1.9129083156585693,  2.7495968341827393,
            -0.7420240044593811, 4.856568336486816,    -0.7563357949256897
          ],
          'descriptor': {shape: [2, 3, 4], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'tanh',
        'arguments': [{'input': 'tanhInput'}],
        'outputs': 'tanhOutput'
      }],
      'expectedOutputs': {
        'tanhOutput': {
          'data': [
            0.9999647736549377,  -0.8189298510551453, 0.38630160689353943,
            0.9498035907745361,  0.9935782551765442,  -0.9997855424880981,
            0.9994998574256897,  -0.9994121193885803, -0.9988092184066772,
            0.7200349569320679,  -0.1103789210319519, 0.9999865293502808,
            0.945036768913269,   0.9993596076965332,  0.9999719858169556,
            -0.9999482035636902, 0.8885080814361572,  -0.9999779462814331,
            -0.894483745098114,  -0.9573289752006531, 0.9918531775474548,
            -0.6303664445877075, 0.9998790621757507,  -0.6389135718345642
          ],
          'descriptor': {shape: [2, 3, 4], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'tanh float32 4D tensor',
    'graph': {
      'inputs': {
        'tanhInput': {
          'data': [
            5.473527431488037,   -1.1535595655441284,  0.4074455797672272,
            1.8297704458236694,  2.869000196456909,    -4.570195198059082,
            4.146744251251221,   -4.065934181213379,   -3.7128469944000244,
            0.9077175259590149,  -0.11083049327135086, 5.955096244812012,
            1.7831857204437256,  4.023128509521484,    5.587857723236084,
            -5.280653953552246,  1.4147950410842896,   -5.707716941833496,
            -1.443918228149414,  -1.9129083156585693,  2.7495968341827393,
            -0.7420240044593811, 4.856568336486816,    -0.7563357949256897
          ],
          'descriptor': {shape: [2, 2, 2, 3], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'tanh',
        'arguments': [{'input': 'tanhInput'}],
        'outputs': 'tanhOutput'
      }],
      'expectedOutputs': {
        'tanhOutput': {
          'data': [
            0.9999647736549377,  -0.8189298510551453, 0.38630160689353943,
            0.9498035907745361,  0.9935782551765442,  -0.9997855424880981,
            0.9994998574256897,  -0.9994121193885803, -0.9988092184066772,
            0.7200349569320679,  -0.1103789210319519, 0.9999865293502808,
            0.945036768913269,   0.9993596076965332,  0.9999719858169556,
            -0.9999482035636902, 0.8885080814361572,  -0.9999779462814331,
            -0.894483745098114,  -0.9573289752006531, 0.9918531775474548,
            -0.6303664445877075, 0.9998790621757507,  -0.6389135718345642
          ],
          'descriptor': {shape: [2, 2, 2, 3], dataType: 'float32'}
        }
      }
    }
  },
  {
    'name': 'tanh float32 5D tensor',
    'graph': {
      'inputs': {
        'tanhInput': {
          'data': [
            5.473527431488037,   -1.1535595655441284,  0.4074455797672272,
            1.8297704458236694,  2.869000196456909,    -4.570195198059082,
            4.146744251251221,   -4.065934181213379,   -3.7128469944000244,
            0.9077175259590149,  -0.11083049327135086, 5.955096244812012,
            1.7831857204437256,  4.023128509521484,    5.587857723236084,
            -5.280653953552246,  1.4147950410842896,   -5.707716941833496,
            -1.443918228149414,  -1.9129083156585693,  2.7495968341827393,
            -0.7420240044593811, 4.856568336486816,    -0.7563357949256897
          ],
          'descriptor': {shape: [2, 1, 4, 1, 3], dataType: 'float32'}
        }
      },
      'operators': [{
        'name': 'tanh',
        'arguments': [{'input': 'tanhInput'}],
        'outputs': 'tanhOutput'
      }],
      'expectedOutputs': {
        'tanhOutput': {
          'data': [
            0.9999647736549377,  -0.8189298510551453, 0.38630160689353943,
            0.9498035907745361,  0.9935782551765442,  -0.9997855424880981,
            0.9994998574256897,  -0.9994121193885803, -0.9988092184066772,
            0.7200349569320679,  -0.1103789210319519, 0.9999865293502808,
            0.945036768913269,   0.9993596076965332,  0.9999719858169556,
            -0.9999482035636902, 0.8885080814361572,  -0.9999779462814331,
            -0.894483745098114,  -0.9573289752006531, 0.9918531775474548,
            -0.6303664445877075, 0.9998790621757507,  -0.6389135718345642
          ],
          'descriptor': {shape: [2, 1, 4, 1, 3], dataType: 'float32'}
        }
      }
    }
  }
];

if (navigator.ml) {
  tanhTests.forEach((test) => {
    webnn_conformance_test(
        buildAndExecuteGraph, getTanhPrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
