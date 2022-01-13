from heapq import heapify, heappush, heappop

from pathfinder.algorithms.Nodes import Node, PrioritizedItem

import random


class Graph:
    # TODO remove for loop from self.nodes initilization and mix it with the second for loop

    def __init__(self, grid):
        """
        precondition: grid will contain a uniform amount of nodes per row
        """
        self.nodes = [[Node() for column in range(len(grid[1]))]
                      for row in range(len(grid))]

        self.v = 0
        self.edges = {}

        self.visited = []
        self.path = []
        self.distances = {}
        for row in range(len(grid)):
            for col in range(len(grid[row])):
                self.v += 1  # number of vertices
                node = self.nodes[row][col]
                node.value = grid[row][col]
                node.x = col
                node.y = row
                self.edges[node] = {}
                weight = 1
                if not node.is_wall():

                    if col < len(grid[row])-1:
                        neighbor = self.nodes[row][col+1]
                        neighbor.value = grid[row][col+1]
                        neighbor.x = col+1
                        neighbor.y = row
                        self.add_edge(node, neighbor, weight)

                    if col > 0:
                        neighbor = self.nodes[row][col-1]
                        neighbor.value = grid[row][col-1]
                        neighbor.x = col-1
                        neighbor.y = row
                        self.add_edge(node, neighbor, weight)

                    if row < len(grid)-1:
                        neighbor = self.nodes[row+1][col]
                        neighbor.value = grid[row+1][col]
                        neighbor.x = col
                        neighbor.y = row+1
                        self.add_edge(node, neighbor, weight)

                    if row > 0:
                        neighbor = self.nodes[row-1][col]
                        neighbor.value = grid[row-1][col]
                        neighbor.x = col
                        neighbor.y = row-1
                        self.add_edge(node, neighbor, weight)

    def add_edge(self, u, v, weight):
        # this new set up the edges dict will have the same interface as the adjacency map
        # i.e edges[u][v] will still out put a weight if the nodes exist in memory
        # space complexity goes from O(n^2) to O(n*e) or 4n-(2*width + 2*height)(all nodes have 4 edges, except grid borders in our use case)

        if not v.is_wall():
            if u not in self.edges:
                self.edges[u] = {v: weight}
            else:
                self.edges[u][v] = weight

            if v not in self.edges:
                self.edges[v] = {u: weight}
            else:
                self.edges[v][u] = weight

    @staticmethod
    def heuristic(curr: Node, goal: Node, D: int = 1) -> int:
        return D*(abs(curr.x-goal.x) + abs(curr.y - goal.y))

    @staticmethod
    def dijkstra_f_cost(g, h):
        f = g
        return f

    @staticmethod
    def greedy_f_cost(g, h):
        f = h
        return f

    @staticmethod
    def astar_f_cost(g, h):
        f = g+h
        return f

    def best_first_search(self, start_vertex, end_vertex, f):
        distances = {self.nodes[i][j]: float('inf') for i in range(len(self.nodes))
                     for j in range(len(self.nodes[i]))}
        distances[start_vertex] = 0  # f cost
        pq = []
        # open_list = []
        heappush(pq, PrioritizedItem(0, start_vertex))
        # open_list.append(start_vertex)
        while pq:
            curr_vertex = heappop(pq).item
            # open_list.remove(curr_vertex)
            self.visited.append(curr_vertex)
            if curr_vertex == end_vertex:
                break

            else:

                self.visited.append(curr_vertex)

                for neighbor in self.edges[curr_vertex]:
                    weight = self.edges[curr_vertex][neighbor]
                    heuristic = self.heuristic(curr_vertex, end_vertex, weight)
                    g_cost = distances[curr_vertex] + weight
                    old_g_cost = distances[neighbor]

                    f_cost = f(g_cost, heuristic)
                    # if old_g_cost < g_cost and neighbor in self.visited:
                    #     index = self.visited.index(neighbor)
                    #     self.visited[index] = curr_vertex
                    #     distances[neighbor] = g_cost
                    #     neighbor.set_prev(curr_vertex)
                    if neighbor in self.visited:
                        continue
                    for node in pq:
                        node = node.item
                        if neighbor.x == node.x and neighbor.y == node.y:
                            if old_g_cost != distances[node]:
                                # print(node, old_g_cost, distances[node])
                                continue
                    else:

                        if g_cost < old_g_cost:
                            heappush(pq, PrioritizedItem(f_cost, neighbor))
                            distances[neighbor] = g_cost
                            neighbor.set_prev(curr_vertex)

        return self.visited

    def dijkstra(self, start_vertex, end_vertex):
        self.best_first_search(start_vertex, end_vertex, self.dijkstra_f_cost)
        return self.visited
        """
            # TODO handle case where there is no start and end ndoe, or case where they overlap each other

            distances = {self.nodes[i][j]: float('inf') for i in range(len(self.nodes))
                        for j in range(len(self.nodes[i]))}
            distances[start_vertex] = 0
            # print(distances)
            pq = []
            heappush(pq, PrioritizedItem(0, start_vertex))
            while pq:

                current_vertex = heappop(pq).item
                self.visited.append(current_vertex)
                for neighbor in self.edges[current_vertex]:
                    weight = self.edges[current_vertex][neighbor]
                    if neighbor not in self.visited:

                        old_cost = distances[neighbor]
                        new_cost = distances[current_vertex] + weight
                        if new_cost < old_cost:
                            heappush(pq, PrioritizedItem(new_cost, neighbor))
                            distances[neighbor] = new_cost
                            neighbor.set_prev(current_vertex)
            self.distances = distances
            return self.visited
        """

    def a_star(self, start_vertex, end_vertex):
        self.best_first_search(start_vertex, end_vertex, self.astar_f_cost)
        return self.visited

    def greedy_bfs(self, start_vertex, end_vertex):
        self.best_first_search(start_vertex, end_vertex, self.greedy_f_cost)
        return self.visited

    def shortest(self, node):
        if node.previous:
            self.path.append(node.previous)
            self.shortest(node.previous)

        return

    def get_paths(self, target):
        self.path.append(target)
        self.shortest(target)
        return self.path


if __name__ == "__main__":

    ...
