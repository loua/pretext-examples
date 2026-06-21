var ptx_lunr_search_style = "textbook";
var ptx_lunr_docs = [
{
  "id": "front-colophon",
  "level": "1",
  "url": "front-colophon.html",
  "type": "Colophon",
  "number": "",
  "title": "Colophon",
  "body": "  "
},
{
  "id": "parsons-overflow-tests",
  "level": "1",
  "url": "parsons-overflow-tests.html",
  "type": "Section",
  "number": "1.1",
  "title": "Parsons Left-Numbering Overflow Tests I",
  "body": " Parsons Left-Numbering Overflow Tests I   This page contains test cases for verifying that numbered=\"left\" on Parsons blocks does not cause the source area to overflow its container. Each exercise targets a different combination of options that could interact with the left-label width calculation.     Group 1: Baseline (original bug-report cases)     Case 1-A: Short lines, adaptive, indentation hidden, left-numbered. This mirrors the first example from the original bug report.     x = 1    x = 2    x = 3        Case 1-B: Paired distractors, adaptive, indentation hidden, left-numbered. Mirrors the second example from the original bug report.     def write_line(file, output):    fout = open(file, 'w')  fout = open(file, 'r')    fout.write(output + \"\\n\")  fout.write(output)    fout.close()  fout.close        Group 2: Non-adaptive (static) exercises     Case 2-A: Static (non-adaptive), indentation hidden, left-numbered. Verifies that the fix works without the adaptive scaffolding path.     total = 0  total = 1    for i in range(10):  for i in range(0, 10, 1):    total += i  total = total + 1    print(total)        Case 2-B: Static, indentation enabled , left-numbered. Tests that the label width interacts correctly with indent columns.     def greet(name):    message = \"Hello, \" + name  message = \"Hello \" + name    return message    print(greet(\"World\"))        Group 3: Long lines     Case 3-A: Long code lines, adaptive, left-numbered. The wider blocks mean the label column competes for the most space.      def calculate_average(numbers_list):    def calculateAverage(numbers_list):      total = sum(numbers_list)    total = numbers_list.sum()      count = len(numbers_list)    count = numbers_list.count()      return total \/ count if count != 0 else 0    return total \/ count         Case 3-B: Very long lines, static, left-numbered. Tests the worst-case for horizontal overflow.      result = [item for item in my_long_list if item.is_valid()]    result = filter(lambda item: item.is_valid(), my_long_list)      formatted = \", \".join(str(x) for x in result)    formatted = str(result).strip(\"[]\")      print(f\"Found {len(result)} valid items: {formatted}\")    print(\"Found \" + str(len(result)) + \" valid items: \" + formatted)         Group 4: Ten or more blocks (double-digit line numbers)     Case 4-A: Ten blocks, adaptive, left-numbered. At 10+ blocks the label gets an extra space for alignment; verify this extra padding does not cause overflow.     scores = []    scores.append(85)  scores.add(85)    scores.append(92)    scores.append(78)    scores.append(95)    scores.append(88)    scores.append(73)    scores.append(91)    average = sum(scores) \/ len(scores)  average = sum(scores) \/ 8    print(f\"Average: {average:.2f}\")  print(\"Average: \" + average)        Case 4-B: Twelve blocks, adaptive, indentation enabled , left-numbered. Combines the double-digit label path with indent columns.     def classify_grade(score):    if score >= 90:  if score > 90:    return \"A\"    elif score >= 80:    return \"B\"    elif score >= 70:    return \"C\"    elif score >= 60:    return \"D\"    else:    return \"F\"    print(classify_grade(85))        Group 5: Different languages     Case 5-A: Java, adaptive, indentation hidden, left-numbered.      public static int sum(int[] arr) {    public int sum(int[] arr) {     int total = 0;     for (int num : arr) {    for (int i = 0; i < arr.length; i++) {     total += num;    }    return total;    }        Case 5-B: Natural language, adaptive, left-numbered. Natural language steps can be long prose; tests that the label column does not push prose lines out of the source area.      Open the file for writing.    Open the file for reading.     Write the header row to the file.     Loop over each record in the dataset.    Loop over each column in the dataset.     Write the current record to the file.    Close the file when finished.        Group 6: Right-numbered (control comparison)     Case 6-A: Right -numbered, adaptive, no indent. Numbers on the right should be unaffected by the left-label fix; use this as a visual baseline to confirm right-numbering still works.     x = 1  x = 0    y = x + 1  y = x - 1    print(y)        Case 6-B: Right-numbered, paired distractors, adaptive. Paired bins with right labels should look identical to pre-fix behavior.     def cube(n):    return n ** 3  return n * 3    print(cube(4))        Group 7: Multiple indent levels with left numbering     Case 7-A: Three levels of indentation, adaptive, left-numbered. Deep indentation reduces the effective code width; the label column must still fit without causing the outer container to overflow.     def process(data):     for row in data:    for row in range(data):      if row is not None:    if row != None:     results.append(row)    return results        Case 7-B: Mixed indentation, long lines, static (non-adaptive), left-numbered. Combines the widest lines with indent columns to stress-test the layout.     def find_duplicates(input_list):     seen = set()    seen = []      duplicates = []    duplicates = set()     for item in input_list:     if item in seen and item not in duplicates:    if item in seen:     duplicates.append(item)    seen.add(item)    return duplicates        Group 8: No numbering (control — confirms fix is non-breaking)     Case 8-A: No line numbers at all, adaptive, no indent. Confirms the fix does not accidentally break the default (unnumbered) layout.     a = int(input(\"Enter a: \"))  a = input(\"Enter a: \")    b = int(input(\"Enter b: \"))  b = input(\"Enter b: \")    print(a + b)  print(a, b)        Case 8-B: No line numbers, static, indentation enabled. A second unnumbered control case with indentation.     def is_even(n):    return n % 2 == 0  return n % 2 != 0    print(is_even(4))      "
},
{
  "id": "test-1a-short-adaptive-noi",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-1a-short-adaptive-noi",
  "type": "Activity",
  "number": "1.1.1",
  "title": "",
  "body": "  Case 1-A: Short lines, adaptive, indentation hidden, left-numbered. This mirrors the first example from the original bug report.     x = 1    x = 2    x = 3    "
},
{
  "id": "test-1b-paired-adaptive-noi",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-1b-paired-adaptive-noi",
  "type": "Activity",
  "number": "1.1.2",
  "title": "",
  "body": "  Case 1-B: Paired distractors, adaptive, indentation hidden, left-numbered. Mirrors the second example from the original bug report.     def write_line(file, output):    fout = open(file, 'w')  fout = open(file, 'r')    fout.write(output + \"\\n\")  fout.write(output)    fout.close()  fout.close    "
},
{
  "id": "test-2a-static-noi",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-2a-static-noi",
  "type": "Activity",
  "number": "1.1.3",
  "title": "",
  "body": "  Case 2-A: Static (non-adaptive), indentation hidden, left-numbered. Verifies that the fix works without the adaptive scaffolding path.     total = 0  total = 1    for i in range(10):  for i in range(0, 10, 1):    total += i  total = total + 1    print(total)    "
},
{
  "id": "test-2b-static-with-indent",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-2b-static-with-indent",
  "type": "Activity",
  "number": "1.1.4",
  "title": "",
  "body": "  Case 2-B: Static, indentation enabled , left-numbered. Tests that the label width interacts correctly with indent columns.     def greet(name):    message = \"Hello, \" + name  message = \"Hello \" + name    return message    print(greet(\"World\"))    "
},
{
  "id": "test-3a-long-lines-adaptive",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-3a-long-lines-adaptive",
  "type": "Activity",
  "number": "1.1.5",
  "title": "",
  "body": "  Case 3-A: Long code lines, adaptive, left-numbered. The wider blocks mean the label column competes for the most space.      def calculate_average(numbers_list):    def calculateAverage(numbers_list):      total = sum(numbers_list)    total = numbers_list.sum()      count = len(numbers_list)    count = numbers_list.count()      return total \/ count if count != 0 else 0    return total \/ count     "
},
{
  "id": "test-3b-very-long-lines",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-3b-very-long-lines",
  "type": "Activity",
  "number": "1.1.6",
  "title": "",
  "body": "  Case 3-B: Very long lines, static, left-numbered. Tests the worst-case for horizontal overflow.      result = [item for item in my_long_list if item.is_valid()]    result = filter(lambda item: item.is_valid(), my_long_list)      formatted = \", \".join(str(x) for x in result)    formatted = str(result).strip(\"[]\")      print(f\"Found {len(result)} valid items: {formatted}\")    print(\"Found \" + str(len(result)) + \" valid items: \" + formatted)     "
},
{
  "id": "test-4a-ten-blocks",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-4a-ten-blocks",
  "type": "Activity",
  "number": "1.1.7",
  "title": "",
  "body": "  Case 4-A: Ten blocks, adaptive, left-numbered. At 10+ blocks the label gets an extra space for alignment; verify this extra padding does not cause overflow.     scores = []    scores.append(85)  scores.add(85)    scores.append(92)    scores.append(78)    scores.append(95)    scores.append(88)    scores.append(73)    scores.append(91)    average = sum(scores) \/ len(scores)  average = sum(scores) \/ 8    print(f\"Average: {average:.2f}\")  print(\"Average: \" + average)    "
},
{
  "id": "test-4b-twelve-blocks-indent",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-4b-twelve-blocks-indent",
  "type": "Activity",
  "number": "1.1.8",
  "title": "",
  "body": "  Case 4-B: Twelve blocks, adaptive, indentation enabled , left-numbered. Combines the double-digit label path with indent columns.     def classify_grade(score):    if score >= 90:  if score > 90:    return \"A\"    elif score >= 80:    return \"B\"    elif score >= 70:    return \"C\"    elif score >= 60:    return \"D\"    else:    return \"F\"    print(classify_grade(85))    "
},
{
  "id": "test-5a-java",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-5a-java",
  "type": "Activity",
  "number": "1.1.9",
  "title": "",
  "body": "  Case 5-A: Java, adaptive, indentation hidden, left-numbered.      public static int sum(int[] arr) {    public int sum(int[] arr) {     int total = 0;     for (int num : arr) {    for (int i = 0; i < arr.length; i++) {     total += num;    }    return total;    }    "
},
{
  "id": "test-5b-natural",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-5b-natural",
  "type": "Activity",
  "number": "1.1.10",
  "title": "",
  "body": "  Case 5-B: Natural language, adaptive, left-numbered. Natural language steps can be long prose; tests that the label column does not push prose lines out of the source area.      Open the file for writing.    Open the file for reading.     Write the header row to the file.     Loop over each record in the dataset.    Loop over each column in the dataset.     Write the current record to the file.    Close the file when finished.    "
},
{
  "id": "test-6a-right-adaptive-noi",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-6a-right-adaptive-noi",
  "type": "Activity",
  "number": "1.1.11",
  "title": "",
  "body": "  Case 6-A: Right -numbered, adaptive, no indent. Numbers on the right should be unaffected by the left-label fix; use this as a visual baseline to confirm right-numbering still works.     x = 1  x = 0    y = x + 1  y = x - 1    print(y)    "
},
{
  "id": "test-6b-right-paired",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-6b-right-paired",
  "type": "Activity",
  "number": "1.1.12",
  "title": "",
  "body": "  Case 6-B: Right-numbered, paired distractors, adaptive. Paired bins with right labels should look identical to pre-fix behavior.     def cube(n):    return n ** 3  return n * 3    print(cube(4))    "
},
{
  "id": "test-7a-deep-indent-adaptive",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-7a-deep-indent-adaptive",
  "type": "Activity",
  "number": "1.1.13",
  "title": "",
  "body": "  Case 7-A: Three levels of indentation, adaptive, left-numbered. Deep indentation reduces the effective code width; the label column must still fit without causing the outer container to overflow.     def process(data):     for row in data:    for row in range(data):      if row is not None:    if row != None:     results.append(row)    return results    "
},
{
  "id": "test-7b-indent-long-static",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-7b-indent-long-static",
  "type": "Activity",
  "number": "1.1.14",
  "title": "",
  "body": "  Case 7-B: Mixed indentation, long lines, static (non-adaptive), left-numbered. Combines the widest lines with indent columns to stress-test the layout.     def find_duplicates(input_list):     seen = set()    seen = []      duplicates = []    duplicates = set()     for item in input_list:     if item in seen and item not in duplicates:    if item in seen:     duplicates.append(item)    seen.add(item)    return duplicates    "
},
{
  "id": "test-8a-no-numbers-adaptive",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-8a-no-numbers-adaptive",
  "type": "Activity",
  "number": "1.1.15",
  "title": "",
  "body": "  Case 8-A: No line numbers at all, adaptive, no indent. Confirms the fix does not accidentally break the default (unnumbered) layout.     a = int(input(\"Enter a: \"))  a = input(\"Enter a: \")    b = int(input(\"Enter b: \"))  b = input(\"Enter b: \")    print(a + b)  print(a, b)    "
},
{
  "id": "test-8b-no-numbers-static-indent",
  "level": "2",
  "url": "parsons-overflow-tests.html#test-8b-no-numbers-static-indent",
  "type": "Activity",
  "number": "1.1.16",
  "title": "",
  "body": "  Case 8-B: No line numbers, static, indentation enabled. A second unnumbered control case with indentation.     def is_even(n):    return n % 2 == 0  return n % 2 != 0    print(is_even(4))    "
},
{
  "id": "parsons-overflow-tests-v2",
  "level": "1",
  "url": "parsons-overflow-tests-v2.html",
  "type": "Section",
  "number": "1.2",
  "title": "Parsons Left-Numbering Overflow Tests II",
  "body": " Parsons Left-Numbering Overflow Tests II   Comprehensive test cases for the numbered=\"left\" overflow fix. Groups 1–8 appeared in v1; Groups 9–14 cover edge cases identified by code inspection that were not in v1.     Group 9: language=\"math\" (MathJax async sizing)      Case 9-A: language=\"math\" , adaptive, indentation hidden, left-numbered. MathJax rendering is awaited inside the block-width loop; the label column must be added after that await resolves or the area will be sized to the pre-render (narrow) width.      \\(f(x) = x^2 + 2x + 1\\)    \\(f(x) = x^2 - 2x + 1\\)      \\(f'(x) = 2x + 2\\)    \\(f'(x) = 2x - 2\\)      \\(f'(x) = 0 \\Rightarrow x = -1\\)    \\(f'(x) = 0 \\Rightarrow x = 1\\)     \\(f(-1) = 0\\) is the minimum.        Case 9-B: language=\"math\" , static (non-adaptive), indentation enabled, left-numbered. Combines the MathJax sizing path with the indent-column width budget.     Prove that \\(\\sqrt{2}\\) is irrational.     Assume \\(\\sqrt{2} = \\frac{p}{q}\\) in lowest terms.    Assume \\(\\sqrt{2} = \\frac{p}{q}\\) where \\(p, q\\) share a factor.     Then \\(2 = \\frac{p^2}{q^2}\\), so \\(p^2 = 2q^2\\).    So \\(p^2\\) is even, hence \\(p\\) is even.     Write \\(p = 2k\\); then \\(4k^2 = 2q^2\\), so \\(q^2 = 2k^2\\).    Write \\(p = 2k\\); then \\(2k^2 = q^2\\).     So \\(q\\) is also even — contradiction.        Case 9-C: Wide math expressions, adaptive, left-numbered. Large rendered equations push block width further than any code line would; this is the worst case for the MathJax-then-label sizing order.      \\(\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}\\)    \\(\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\pi\\)      Let \\(I = \\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx\\).    Let \\(I = \\int_{0}^{\\infty} e^{-x^2}\\,dx\\).     Then \\(I^2 = \\iint e^{-(x^2+y^2)}\\,dx\\,dy\\).     Convert to polar: \\(I^2 = \\int_0^{2\\pi}\\int_0^\\infty e^{-r^2}r\\,dr\\,d\\theta = \\pi\\).    Convert to polar: \\(I^2 = \\int_0^{\\pi}\\int_0^\\infty e^{-r^2}r\\,dr\\,d\\theta = \\pi\/2\\).         Group 10: \"Help Me\" → removeIndentation() path     Case 10-A: Adaptive, indentation enabled , left-numbered. After 3 failed attempts the \"Help Me\" button becomes active. If all distractors are already removed and blocks ≤ 3, pressing Help Me triggers removeIndentation() , which has its own blockWidth += 25 branch. Verify the source area does not overflow after Help Me fires.     def factorial(n):     if n == 0:    if n == 1:     return 1    return n * factorial(n - 1)        Case 10-B: Adaptive, long lines, indentation enabled, left-numbered. Long lines maximise blockWidth in the removeIndentation() recalculation, exposing any remaining off-by-one in the +25 px branch.     def merge_sorted_lists(list_one, list_two):     result = []    result = list()     i, j = 0, 0     while i < len(list_one) and j < len(list_two):    while i <= len(list_one) and j <= len(list_two):      if list_one[i] <= list_two[j]:    if list_one[i] < list_two[j]:     result.append(list_one[i]); i += 1    else:    result.append(list_two[j]); j += 1    return result + list_one[i:] + list_two[j:]        Group 11: Multi-line blocks     Case 11-A: Blocks with multiple cline s (joined into one draggable unit), adaptive, indentation hidden, left-numbered. The label sits beside a tall block; confirm horizontal layout is unaffected.      def swap(a, b):  return b, a    def swap(a, b):  a, b = b, a     x = 3  y = 7     x, y = swap(x, y)    x, y = swap(y, x)     print(x, y)        Case 11-B: Multi-cline blocks with indentation enabled, left-numbered. Tests that a tall indented block does not push the label column outside the source area.     class Stack:  def __init__(self):  self.items = []     def push(self, item):  self.items.append(item)    def push(self, item):  self.items.insert(0, item)      def pop(self):  return self.items.pop()    def pop(self):  return self.items.pop(0)         Group 12: DAG grader     Case 12-A: DAG grader (order-independent), adaptive, indentation hidden, left-numbered. The tagged blocks follow the same sizing path; confirm labels don't overflow the source area.     import math    import sys    print(math.pi)    print(sys.version)        Group 13: Maximum indent level (answer4)     Case 13-A: Four indent levels, adaptive, left-numbered. This triggers the answer4 CSS class, the deepest indent supported by the standard CSS. The source area width budget is at its minimum: px.     for i in range(3):    for j in range(3):    for k in range(3):     if i != j != k:    if i == j == k:     print(i, j, k)        Case 13-B: Four indent levels, 10+ blocks (double-digit labels), adaptive, left-numbered. This is the narrowest possible source area combined with the widest label column — the triple-threat case.     results = []    for a in range(5):    for b in range(5):    for c in range(5):    for d in range(5):     total = a + b + c + d    total = a * b * c * d      if total == 10:    if total > 10:     results.append((a, b, c, d))    count = len(results)    print(count)        Group 14: Explicit shuffle order     Case 14-A: Explicit block order, adaptive, left-numbered. The order attribute bypasses the random shuffle and places blocks in a fixed sequence. The sizing code runs identically, but this exercises the order-specific branch in createBlocks() .     a = 10  a = 0    b = 20  b = 0    c = a + b    print(c)      "
},
{
  "id": "test-9a-math-adaptive-noi",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-9a-math-adaptive-noi",
  "type": "Activity",
  "number": "1.2.1",
  "title": "",
  "body": "  Case 9-A: language=\"math\" , adaptive, indentation hidden, left-numbered. MathJax rendering is awaited inside the block-width loop; the label column must be added after that await resolves or the area will be sized to the pre-render (narrow) width.      \\(f(x) = x^2 + 2x + 1\\)    \\(f(x) = x^2 - 2x + 1\\)      \\(f'(x) = 2x + 2\\)    \\(f'(x) = 2x - 2\\)      \\(f'(x) = 0 \\Rightarrow x = -1\\)    \\(f'(x) = 0 \\Rightarrow x = 1\\)     \\(f(-1) = 0\\) is the minimum.    "
},
{
  "id": "test-9b-math-static-indent",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-9b-math-static-indent",
  "type": "Activity",
  "number": "1.2.2",
  "title": "",
  "body": "  Case 9-B: language=\"math\" , static (non-adaptive), indentation enabled, left-numbered. Combines the MathJax sizing path with the indent-column width budget.     Prove that \\(\\sqrt{2}\\) is irrational.     Assume \\(\\sqrt{2} = \\frac{p}{q}\\) in lowest terms.    Assume \\(\\sqrt{2} = \\frac{p}{q}\\) where \\(p, q\\) share a factor.     Then \\(2 = \\frac{p^2}{q^2}\\), so \\(p^2 = 2q^2\\).    So \\(p^2\\) is even, hence \\(p\\) is even.     Write \\(p = 2k\\); then \\(4k^2 = 2q^2\\), so \\(q^2 = 2k^2\\).    Write \\(p = 2k\\); then \\(2k^2 = q^2\\).     So \\(q\\) is also even — contradiction.    "
},
{
  "id": "test-9c-math-wide",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-9c-math-wide",
  "type": "Activity",
  "number": "1.2.3",
  "title": "",
  "body": "  Case 9-C: Wide math expressions, adaptive, left-numbered. Large rendered equations push block width further than any code line would; this is the worst case for the MathJax-then-label sizing order.      \\(\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}\\)    \\(\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\pi\\)      Let \\(I = \\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx\\).    Let \\(I = \\int_{0}^{\\infty} e^{-x^2}\\,dx\\).     Then \\(I^2 = \\iint e^{-(x^2+y^2)}\\,dx\\,dy\\).     Convert to polar: \\(I^2 = \\int_0^{2\\pi}\\int_0^\\infty e^{-r^2}r\\,dr\\,d\\theta = \\pi\\).    Convert to polar: \\(I^2 = \\int_0^{\\pi}\\int_0^\\infty e^{-r^2}r\\,dr\\,d\\theta = \\pi\/2\\).     "
},
{
  "id": "test-10a-helpme-indent",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-10a-helpme-indent",
  "type": "Activity",
  "number": "1.2.4",
  "title": "",
  "body": "  Case 10-A: Adaptive, indentation enabled , left-numbered. After 3 failed attempts the \"Help Me\" button becomes active. If all distractors are already removed and blocks ≤ 3, pressing Help Me triggers removeIndentation() , which has its own blockWidth += 25 branch. Verify the source area does not overflow after Help Me fires.     def factorial(n):     if n == 0:    if n == 1:     return 1    return n * factorial(n - 1)    "
},
{
  "id": "test-10b-helpme-long-indent",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-10b-helpme-long-indent",
  "type": "Activity",
  "number": "1.2.5",
  "title": "",
  "body": "  Case 10-B: Adaptive, long lines, indentation enabled, left-numbered. Long lines maximise blockWidth in the removeIndentation() recalculation, exposing any remaining off-by-one in the +25 px branch.     def merge_sorted_lists(list_one, list_two):     result = []    result = list()     i, j = 0, 0     while i < len(list_one) and j < len(list_two):    while i <= len(list_one) and j <= len(list_two):      if list_one[i] <= list_two[j]:    if list_one[i] < list_two[j]:     result.append(list_one[i]); i += 1    else:    result.append(list_two[j]); j += 1    return result + list_one[i:] + list_two[j:]    "
},
{
  "id": "test-11a-multiline-adaptive-noi",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-11a-multiline-adaptive-noi",
  "type": "Activity",
  "number": "1.2.6",
  "title": "",
  "body": "  Case 11-A: Blocks with multiple cline s (joined into one draggable unit), adaptive, indentation hidden, left-numbered. The label sits beside a tall block; confirm horizontal layout is unaffected.      def swap(a, b):  return b, a    def swap(a, b):  a, b = b, a     x = 3  y = 7     x, y = swap(x, y)    x, y = swap(y, x)     print(x, y)    "
},
{
  "id": "test-11b-multiline-indent",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-11b-multiline-indent",
  "type": "Activity",
  "number": "1.2.7",
  "title": "",
  "body": "  Case 11-B: Multi-cline blocks with indentation enabled, left-numbered. Tests that a tall indented block does not push the label column outside the source area.     class Stack:  def __init__(self):  self.items = []     def push(self, item):  self.items.append(item)    def push(self, item):  self.items.insert(0, item)      def pop(self):  return self.items.pop()    def pop(self):  return self.items.pop(0)     "
},
{
  "id": "test-12a-dag-adaptive-noi",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-12a-dag-adaptive-noi",
  "type": "Activity",
  "number": "1.2.8",
  "title": "",
  "body": "  Case 12-A: DAG grader (order-independent), adaptive, indentation hidden, left-numbered. The tagged blocks follow the same sizing path; confirm labels don't overflow the source area.     import math    import sys    print(math.pi)    print(sys.version)    "
},
{
  "id": "test-13a-indent4-adaptive",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-13a-indent4-adaptive",
  "type": "Activity",
  "number": "1.2.9",
  "title": "",
  "body": "  Case 13-A: Four indent levels, adaptive, left-numbered. This triggers the answer4 CSS class, the deepest indent supported by the standard CSS. The source area width budget is at its minimum: px.     for i in range(3):    for j in range(3):    for k in range(3):     if i != j != k:    if i == j == k:     print(i, j, k)    "
},
{
  "id": "test-13b-indent4-tenblocks",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-13b-indent4-tenblocks",
  "type": "Activity",
  "number": "1.2.10",
  "title": "",
  "body": "  Case 13-B: Four indent levels, 10+ blocks (double-digit labels), adaptive, left-numbered. This is the narrowest possible source area combined with the widest label column — the triple-threat case.     results = []    for a in range(5):    for b in range(5):    for c in range(5):    for d in range(5):     total = a + b + c + d    total = a * b * c * d      if total == 10:    if total > 10:     results.append((a, b, c, d))    count = len(results)    print(count)    "
},
{
  "id": "test-14a-fixed-order",
  "level": "2",
  "url": "parsons-overflow-tests-v2.html#test-14a-fixed-order",
  "type": "Activity",
  "number": "1.2.11",
  "title": "",
  "body": "  Case 14-A: Explicit block order, adaptive, left-numbered. The order attribute bypasses the random shuffle and places blocks in a fixed sequence. The sizing code runs identically, but this exercises the order-specific branch in createBlocks() .     a = 10  a = 0    b = 20  b = 0    c = a + b    print(c)    "
},
{
  "id": "backmatter-2",
  "level": "1",
  "url": "backmatter-2.html",
  "type": "Colophon",
  "number": "",
  "title": "Colophon",
  "body": " This book was authored in PreTeXt .  "
}
]

var ptx_lunr_idx = lunr(function () {
  this.ref('id')
  this.field('title')
  this.field('body')
  this.metadataWhitelist = ['position']

  ptx_lunr_docs.forEach(function (doc) {
    this.add(doc)
  }, this)
})
