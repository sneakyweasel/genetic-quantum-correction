# genetic-quantum-correction

- Great news! My solution to the Decodoku quantum error correction puzzles using a genetic algorithm was featured in "A proposal for a minimal surface code experiment" by Dr James R. Wootton at https://arxiv.org/abs/1608.05053

- The university of Basel and the Quantum Science and Technology Center launched a citizen science project called Decodoku about quantum error correction at http://decodoku.com/puzzles and wrote:
> "Now we have over 100 puzzles for you to try. Once you've finished, you'll know more about quantum error correction than we do! So come and tell us scientists how to do our job"

- Telling those pesky PhD quantum scientists how to do their job was clearly a motivation.
- The code can be tested on http://logicien.fr/decodoku/ in the browser.
- It is based on the https://github.com/subprotocol/genetic-js library and was linted with ESlint.
- You can get more information on topological quantum computers and their inner workings with the blog of Dr James Wootton at http://decodoku.blogspot.fr/

HOW TO USE
==========
- Clone the repository
- get a http-server such as https://www.npmjs.com/package/http-server
- Move to the repository directory and launch server (http-server)
- Using your browser go to http://localhost:8080
- Toy with the puzzle variables and genetic strategies if you wish.
- Select a puzzle, click the load button, click the solve button and enjoy the solving process.

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
- Finetuning the different fitness and G.A. variables to maximize evolution speed.
- Use a post-processing optimization to avoid "sticky" clusters, etc.
- I have an idea for a less error prone logical qbit grid with magical math spices (using the n-queens theorem).
