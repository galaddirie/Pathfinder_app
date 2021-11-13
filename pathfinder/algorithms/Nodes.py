class Node:
    
    def __init__(self, value=None, x=None, y=None) -> None:
        self.x = x  # col index
        self.y = y  # row index
        self.value = value
        
        self.previous = None

    

    def is_wall(self):
        return self.value == 'W'

    def set_prev(self, node):
        self.previous = node

    def id(self):
        return str(self.y) + ',' + str(self.x)
    
    

    
