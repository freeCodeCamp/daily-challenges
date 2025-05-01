export const baseChallenge = {
  "challengeId": "6813c678516e86b171929de3",
  "title": "Vowel Count Balance",
  "description": "<p>Given a string, determine whether the number of vowels in the first half of the string is equal to the number of vowels in the second half.</p>\n<ul>\n<li>The string can contain any characters.</li>\n<li>If there's an odd number of characters in the string, ignore the center character.</li>\n</ul>",
  "javascript": {
    "tests": [
      {
        "text": "<p><code>isBalanced(\"racecar\")</code> should return <code>true</code>.</p>",
        "testString": "assert.isTrue(isBalanced(\"racecar\"));"
      },
      {
        "text": "<p><code>isBalanced(\"lorem ipsum\")</code> should return <code>true</code>.</p>",
        "testString": "assert.isTrue(isBalanced(\"lorem ipsum\"));"
      },
      {
        "text": "<p><code>isBalanced(\"kitty ipsum\")</code> should return <code>false</code>.</p>",
        "testString": "assert.isFalse(isBalanced(\"kitty ipsum\"));"
      },
      {
        "text": "<p><code>isBalanced(\"string\")</code> should return <code>false</code>.</p>",
        "testString": "assert.isFalse(isBalanced(\"string\"));"
      },
      {
        "text": "<p><code>isBalanced(\" \")</code> should return <code>true</code>.</p>",
        "testString": "assert.isTrue(isBalanced(\" \"));"
      },
      {
        "text": "<p><code>isBalanced(\"abcdefghijklmnopqrstuvwxyz\")</code> should return <code>false</code>.</p>",
        "testString": "assert.isFalse(isBalanced(\"abcdefghijklmnopqrstuvwxyz\"));"
      },
      {
        "text": "<p><code>isBalanced(\"123a#b!E&#x26;*456-o.U\")</code> should return <code>true</code>.</p>",
        "testString": "assert.isTrue(isBalanced(\"123a#b!E&*456-o.U\"));"
      }
    ],
    "challengeFiles": [
      {
        "contents": "function isBalanced(str) {\n\n  return str;\n}",
        "fileKey": "scriptjs"
      }
    ]
  },
  "python": {
    "tests": [
      {
        "text": "<p><code>isBalanced(\"racecar\")</code> should return <code>True</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertTrue(is_balanced(\"racecar\"))`);\n}})"
      },
      {
        "text": "<p><code>isBalanced(\"lorem ipsum\")</code> should return <code>True</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertTrue(is_balanced(\"lorem ipsum\"))`);\n}})"
      },
      {
        "text": "<p><code>isBalanced(\"kitty ipsum\")</code> should return <code>False</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertFalse(is_balanced(\"kitty ipsum\"))`);\n}})"
      },
      {
        "text": "<p><code>isBalanced(\"string\")</code> should return <code>False</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertFalse(is_balanced(\"string\"))`);\n}})"
      },
      {
        "text": "<p><code>isBalanced(\" \")</code> should return <code>True</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertTrue(is_balanced(\" \"))`);\n}})"
      },
      {
        "text": "<p><code>isBalanced(\"abcdefghijklmnopqrstuvwxyz\")</code> should return <code>False</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertFalse(is_balanced(\"abcdefghijklmnopqrstuvwxyz\"))`);\n}})"
      },
      {
        "text": "<p><code>isBalanced(\"123a#b!E&#x26;*456-o.U\")</code> should return <code>True</code>.</p>",
        "testString": "({test: () => { runPython(`\nfrom unittest import TestCase\nTestCase().assertTrue(is_balanced(\"123a#b!E&*456-o.U\"))`);\n}})"
      }
    ],
    "challengeFiles": [
      {
        "contents": "def is_balanced(s):\n\n    return s\n",
        "fileKey": "mainpy"
      }
    ]
  }
}
