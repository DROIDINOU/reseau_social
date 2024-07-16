function testScope() {
    if (true) {
      let localVar = 10;
      const constVar = 20;
      console.log(localVar, constVar);
    }
    console.log(localVar); 
    console.log(constVar); 
  }
  testScope();