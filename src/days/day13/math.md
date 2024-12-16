1: Aa_x + Bb_x = x
2: Aa_y + Bb_y = y

from 2
3: A = (y - Bb_y) / a_y

from 1, sub 3 for A
4: (y - Bb_y) * a_x / a_y + Bb_x = x
5:  - (B * b_y * a_x / a_y) + Bb_x = x
6: B(b_x - (b_y * a_x / a_y)) = x - (y * a_x / a_y)
7: B = (x - (y * a_x / a_y)) / (b_x - (b_y * a_x / a_y))


So we can solve B then A in sequence. If either are non integer then we can't solve the problem.

There is a special case where A and B are colinear (same slope) since then there could be multiple solutions, need to handle this seperately