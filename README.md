# genetic-quantum-correction

The university of Basel and the Quantum Science and Technology Center launched a citizen science project called Decodoku about quantum error correction and wrote:
> "Now we have over 100 puzzles for you to try. Once you've finished, you'll know more about quantum error correction than we do! So come and tell us scientists how to do our job"

- The 100 puzzle grids submitted by http://decodoku.com/puzzles were left unsolved so I created a genetic algorithm to evolve the optimal solution using genetic.js genetic algorithm library.
- Telling those pesky PhD quantum scientists how to do their job was clearly a motivation since I studied Philosophy.
- The code can be tested on http://logicien.fr and runs in the browser.
- It is based on the https://github.com/subprotocol/genetic-js library and was linted with ESlint.
- You can get more information on topological quantum computers and their inner workings with the blog of Dr James Wootton at http://decodoku.blogspot.fr/

HOW IT WORKS
============
PS: I'll use null clusters to describe groups of linked cells whose sum % 10 === 0.

The world and its rules
-----------------------
- The 8*8 puzzle grid is loaded and considered as the current world.
- The top left corner and the bottom right corner are linked by the relation (? + gridSum + ?) % 10 === 0
- Cells are linked into clusters by links.
- Equilibrium is achieved when every cell is part of a null cluster.

Individual genome
-----------------
Each link between cells is converted to a 1 or 0 if the link between the cell is active or not.
There are 112 links for a 8*8 grid so that makes 5192296858534827628530496329220095 possible unique individuals.
This 112 binary string, the genome, is loaded into the world and groups cells into clusters.

Processing
----------
- The value of the top left corner [0, 0] is processed so that its cluster is null.
- We deduct the value of the bottom right corner [14, 14] since both corners are linked together by (? + gridSum + ?) % 10 === 0
- We group the cells sharing an active link into clusters with a modified floodfill algorithm.

Fitness Ranking
---------------
We get the fitness of the current genome by giving positive and negative values to some outcomes of the processed grid.
This is a very crucial part since it will guide evolution and allow to avoid evolution getting stuck (local maximum).
The instructions given by the puzzle manual were pretty unclear so here's what I came up with :
- We generously reward equilibrium where every cell is part of a null cluster.
- We reward small adjacent null clusters.
- We punish isolated cells who have no links.
- We assign a cost to the use of links.
- We punish not null clusters.

Competition & the reward of breeding
------------------------------------
- The individuals are processed and then compete against each other by comparing their fitness score.
- The fittest individual gets the chance to pass their winning genes to another generation.
- A random mate is found to the winner and combinations of their genome is made by genetic crossover into children.
- Mutations occur to maximize diversity.

Evolution
---------
- This process is repeating as much as needed to find the fittest possible linking genome for a specific puzzle.
- Solution can be saved in text format in the console.

WHAT'S NEXT
===========
- Improving the genetic cross-over during mating by radius based genome swapping.
- Figuring out the deterministic graph theory algorithm behind (in progress).
- Finetuning the different fitness and G.A. variables to maximize.
- Incorporating this into the dynamical Decodoku game (in progress).
- Much resources are used to generate the graphical interface so feel free to tweak it.
- Use a post-processing optimization to avoid "sticky" clusters, etc.
- Have a guided evolution subsystem focusing on the stability of top right and bottom left corners.
- Kind have an idea of less error prone quantum grid with magical math spices.
