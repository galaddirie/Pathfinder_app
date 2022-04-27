from msilib.schema import Class
from django.test import TestCase
from .algorithms.PathFinder import Graph
# Create your tests here.


class AlgorithimTestCase(TestCase):

    def setUp(self) -> None:
        grid1 = [
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 ,'W','W','W','W', 0 ],
            [ 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 ,'S', 0 , 0 ,'W', 0 ],
            [ 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 ,'W','W','W','W', 0 ],
            [ 0 , 0 , 0 , 0 , 0 ,'F'],
        ]
        #Shortest Path 11   
        self.g1 = Graph(grid1)
        self.s1 = self.g1.nodes[4][1]
        self.e1 = self.g1.nodes[8][5]

        grid2 = [
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 ,'S', 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 ,'F'],
        ]
        #Shortest Path 8
        self.g2 = Graph(grid2)
        self.s2 = self.g2.nodes[4][1]
        self.e2 = self.g2.nodes[7][5]
        grid3 = [
            [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            ['W','W', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'W','W'],
            [ 0 ,'W', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 ,'W', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'W', 0 ],
            ['S','W', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'W','F'],
            [ 0 ,'W', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 ,'W', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'W', 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]
        ]
        # Shortest path 32
        self.g3 = Graph(grid3)
        self.s3 = self.g3.nodes[4][0]
        self.e3 = self.g3.nodes[4][-1]
        
    #############################################################
    def test_astar_concave_obstcale(self) -> None:
        visited = self.g1.dispatch('astar',[self.s1, self.e1])
        path = self.g1.get_paths(self.e1)
        self.assertEqual(len(path), 11)

    def test_astar_no_obstcale(self)->None:
        visited = self.g2.dispatch('astar',[self.s2, self.e2])
        path = self.g2.get_paths(self.e2)
        self.assertEqual(len(path), 8)
    
    def test_astar_large_concave_obstacles(self) -> None:
        visited = self.g3.dispatch('astar',[self.s3, self.e3])
        path = self.g3.get_paths(self.e3)
        self.assertEqual(len(path), 32)
    
    #############################################################
    def test_dijkstra_concave_obstcale(self) -> None:
        visited = self.g1.dispatch('dijkstra',[self.s1, self.e1])
        path = self.g1.get_paths(self.e1)
        self.assertEqual(len(path), 11)

    def test_dijkstra_no_obstcale(self)->None:
        visited = self.g2.dispatch('dijkstra',[self.s2, self.e2])
        path = self.g2.get_paths(self.e2)
        self.assertEqual(len(path), 8)
    
    def test_dijkstra_large_concave_obstacles(self) -> None:
        visited = self.g3.dispatch('dijkstra',[self.s3, self.e3])
        path = self.g3.get_paths(self.e3)
        self.assertEqual(len(path), 32)
    
    #################################################################
    def test_greedy_bfs_concave_obstcale(self) -> None:
        visited = self.g1.dispatch('greedyBfs',[self.s1, self.e1])
        path = self.g1.get_paths(self.e1)
        self.assertNotEqual(len(path), 11)

    def test_greedy_bfs_no_obstcale(self) -> None:
        visited = self.g2.dispatch('greedyBfs',[self.s2, self.e2])
        path = self.g2.get_paths(self.e2)
        self.assertEqual(len(path), 8)
    
    def test_greedy_bfs_large_concave_obstacles(self) -> None:
        visited = self.g3.dispatch('greedyBfs',[self.s3, self.e3])
        path = self.g3.get_paths(self.e3)
        self.assertEqual(len(path), 32)