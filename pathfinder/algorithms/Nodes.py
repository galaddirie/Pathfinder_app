from dataclasses import dataclass, field
from typing import Any


@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: object = field(compare=False)

    # def __contains__(self, item):
    #     print('checking')
    #     return self.item.x == item.x and self.item.y == item.y


class Node:

    def __init__(self, value=None, x=None, y=None) -> None:
        self.x = x  # col index
        self.y = y  # row index
        self.value = value
        self.g = None
        self.h = None
        self.f = None
        self.previous = None

    def __str__(self):
        return f"Node({self.x},{self.y})"

    def __repr__(self):
        return f"Node({self.x},{self.y})"

    # def __ge__(self):
    #     ./..
    # def __c
    # def __hash__(self):
    #     return hash((self.x, self.y))

    # def __eq__(self, other: object) -> bool:
    #     return self.x == other.x and self.y == other.y

    def is_wall(self):
        return self.value == 'W'

    def set_prev(self, node):
        self.previous = node

    def id(self):
        return str(self.y) + ',' + str(self.x)
