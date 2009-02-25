Spec = function(specs){
  //set up environment
  // apply prototypal methods, if used
  if (!this.using_wrapper)
  {
    var expectation_keys = Object.keys(Spec.Expectations)
    Object.extend(Object.prototype,Spec.Expectations)
  }else
  {
    expectation_keys = []
    window[this.wrapper_name] = function(res){Object.extend(res,Spec.Expectations)}
  }
  //specs.each do |property|
  // if Object.isFunction(property)
  //   example()
 for (var property in specs) {
   
 /**
   *  Array#indexOf(item[, offset = 0]) -> Number
   *  - item (?): A value that may or may not be in the array.
   *  - offset (Number): The number of initial items to skip before beginning the
   *      search.
   *
   *  Returns the position of the first occurrence of `item` within the array — or
   *  `-1` if `item` doesn’t exist in the array.
  **/
  expectation_keys.indexOf=function /*indexOf*/(item, i) {
    i || (i = 0);
    var length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++)
      if (this[i] === item) return i;
    return -1;
  }
   expectation_keys.include = function(){return this.indexOf(property)!=-1}
   if(!expectation_keys.include(property))
   {
     var example = specs[property]
     //write out some stuff
     Spec.logger(property)
     //-------------------
     if (typeof example =="function") {Spec.enter_example();example();Spec.logger('.');Spec.exit_example()}
     else if (typeof example =="undefined") Spec.logger('undefined')
     else if (example == 'pending') Spec.logger('pending')
     else Spec(example)
   }
 }

}

Spec.enter_example = function(){
  this.in_example = true
  //setup example DOM
}
Spec.exit_example = function(){
  this.in_example = false
}


Spec.Expectations = {
  should: function (matcher,expected){
    //alert (matcher+Spec.Matcher[matcher])
    var matched = Spec.Matcher[matcher](expected,this);
    if( !matched ) Spec.logger('expected '+expected+' but received ' +this)
  },
  should_not: function(matcher,expected){
  }
}

//Object.prototype.should_not

Spec.Matcher = {
    '==': function(expected,returned) {
      var result = expected == returned
      this.failure_message = ' expected '+expected + ' to equal ' + 
      return 
    },
    'have_key': function(expected_key,returned){
      for (var property in returned){
        if (property==expected_key)return true}
      }
  }




Spec.logger = function(msg){ if(!this.in_example) document.write('<br>');document.write(msg); }

Spec.use_wrapper=function(){
  Spec.using_wrapper = true;
}


