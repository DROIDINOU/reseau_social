#A tuple is a collection which is ordered and unchangeable.
#thistuple = ("apple", "banana", "cherry")
# Once a tuple is created, you cannot change its values. Tuples are unchangeable, or immutable as it also is called.
# work around pour modifier tupple
"""thistuple = ("apple", "banana", "cherry")
y = list(thistuple)
y.append("orange")
thistuple = tuple(y)"""
"""thistuple = ("apple", "banana", "cherry")
y = ("orange",)
thistuple += y

print(thistuple)"""
#Note: When creating a tuple with only one item, remember to include a comma after the item, otherwise it will not be identified as a tuple.
#unpacking
"""fruits = ("apple", "banana", "cherry")

(green, yellow, red) = fruits"""
"""fruits = ("apple", "banana", "cherry", "strawberry", "raspberry")

(green, yellow, *red) = fruits

print(green)
print(yellow)
print(red)
"""
"""fruits = ("apple", "mango", "papaya", "pineapple", "cherry")

(green, *tropic, red) = fruits

print(green)
print(tropic)
print(red)"""
#tupple methodes 
"""count()	Returns the number of times a specified value occurs in a tuple
index()	Searches the tuple for a specified value and returns the position of where it was found"""

# sets 
# myset = {"apple", "banana", "cherry"}
#A set is a collection which is unordered, unchangeable*, and unindexed. and do not allow duplicates
# Note: The values True and 1 are considered the same value in sets, and are treated as duplicates:
#Note: The values True and 1 are considered the same value in sets, and are treated as duplicates:
#Once a set is created, you cannot change its items, but you can add new items. .add
"""Add elements from tropical into thisset:

thisset = {"apple", "banana", "cherry"}
tropical = {"pineapple", "mango", "papaya"}

thisset.update(tropical)

print(thisset)"""
#The object in the update() method does not have to be a set, it can be any iterable object (tuples, lists, dictionaries etc.).
#To remove an item in a set, use the remove(), or the discard() method. + pop
# intersection methode 
# Use & to join two sets:
"""
set1 = {"apple", "banana", "cherry"}
set2 = {"google", "microsoft", "apple"}

set3 = set1 & set2
print(set3)
Note: The & operator only allows you to join sets with sets, and not with other data types like you can with the intersection() method."""
# scope GLOBAL ET NON LOCAL
array = [[1,2,3,4],[1,2,3]]
x =array[::]
array[0].append(1)
print(array)
print(x)

#dictionnaries
#json.loads / json.dumps
"""
class Myiterator():

    def __iter__(self):
        self.a = 1
        return self
    def __next__(self):
        x = self.a 
        self.a +=1
        return x

x = Myiterator()
print(iter(x))
print(next(x))"""

def t():
   x = 6
   print(x)
   def r ():
      x = 6
      print(x)
   r()
print(t())