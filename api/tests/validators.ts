export const validateNotEmpty = (received : any) => {
    expect(received).not.toBeNull();
    expect(received).not.toBeUndefined();
    expect(received).toBeTruthy();
  };
  
  
  export const validateStringEquality = (received : any, expected : any) => {
    expect(received).not.toEqual('dummydfasfsdfsdfasdsd');
    expect(received).toEqual(expected);
  };
  
  
  export const validateMongoDuplicationError = (name : string, code : number) => {
    expect(name).not.toEqual(/dummy/i);
    expect(name).toEqual('MongoError');
    expect(code).not.toBe(255);
    expect(code).toBe(11000);
  };
  
  