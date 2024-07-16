class testing:
    val = 11
    def __init__(self, y):
       self._param = y
    
    def view(self):
        self.val+=1
    @property
    def param(self):
        return self._param
    
    @param.setter
    def param (self,value):
        self._param = value

    @classmethod
    def jesuis(cls):
        cls.val += 1
        return "je suis une methode de classe"

    


x = testing(10)
print(x.view())
print(testing.val)
print(x.val)
x.param = 11
print(x.view())
print(x.jesuis())

print(testing.val)
