import typing
import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import pathfinder
from pathfinder.algorithms.dijkstra import Graph, PrioritizedItem
# Create your views here.
import sys

def home(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
   
    result = request.GET.get('result',None)

    print(sys.getsizeof(result))
    start= request.GET.get('start',None)
    end = request.GET.get('end',None)
    if is_ajax:
        #data from dijkstra goes here
        start = start.split(',')
        end = end.split(',')
        start_y, start_x = int(start[0]), int(start[1])
        end_y, end_x = int(end[0]), int(end[1])

        g = Graph(json.loads(result))
        start_node = g.nodes[start_y][start_x]
        end_node= g.nodes[end_y][end_x]
        visited = g.dijkstra(start_node)[1]
        path = g.get_paths(end_node)

        acc = []
        for node in visited:
            loc = node.id()
            acc.append(loc)
            if node == end_node:
                break

        acc2 = []
        for node in path:
            target = node.id()
            acc2.append(target)
        print(sys.getsizeof(acc))
        return JsonResponse({'visited':acc, 'path':acc2})
    return render(request, 'pathfinder/home.html', context={'data':result})

def test(request):
    return HttpResponse('hello')