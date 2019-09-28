import unittest

import extract

LINES='''< adultos><40>
< anal >,< porn><70>
< anal >,< xxx><30>
< anal >,<fuck><70>'''.split("\n")

class ExtractText(unittest.TestCase):
    def test_line(self):
        self.assertEquals(
            extract.from_line(LINES[0]),
            (".* adultos", 40))

    def test_combi_line(self):
        self.assertEquals(
            extract.from_line(LINES[1]),
            ("(?=.* anal ).* porn", 70))

    def test_line_w_comment(self):
        self.assertEquals(
            extract.from_line(LINES[0] + "# some comment"),
            (".* adultos", 40))

    def test_lines(self):
        self.assertEquals(
            extract.from_lines(LINES),
            {40: ".* adultos",
             30: "(?=.* anal ).* xxx",
             70: "(?=.* anal ).* porn|(?=.* anal ).*fuck"
            })

