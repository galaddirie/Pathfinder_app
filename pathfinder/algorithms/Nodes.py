from dataclasses import dataclass, field


@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: object = field(compare=False)

    # def __contains__(self, item):
    #     print('checking')
    #     return self.item.x == item.x and self.item.y == item.y


class Node:

    def __init__(self, value: str = None, x: int = None, y: int = None) -> None:
        self.x = x  # col index
        self.y = y  # row index
        self.value = value
        self.g = None
        self.h = None
        self.f = None
        self.previous = None

    def __str__(self) -> str:
        return f"Node({self.x},{self.y})"

    def __repr__(self) -> str:
        return f"Node({self.x},{self.y})"

    # def __ge__(self):
    #     ./..
    # def __c
    # def __hash__(self):
    #     return hash((self.x, self.y))

    # def __eq__(self, other: object) -> bool:
    #     return self.x == other.x and self.y == other.y

    def is_wall(self) -> bool:
        return self.value == 'W'

    def set_prev(self, node: object) -> None:
        self.previous = node

    def id(self) -> str:
        return str(self.y) + ',' + str(self.x)
