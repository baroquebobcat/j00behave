Spec = function(name,specs,opts){
/*  var name = Object.isString(arguments[0]) ? :''
  var specs = name != '' ? arguments[1] : arguments[0]*/
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
   
//from prototype enumerable
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
     else Spec(property,example)
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
    var matched = Spec.Matcher.find(matcher)(expected,this);
    if( !matched.result ) Spec.logger(matched.failure_message)
  },
  should_not: function (matcher,expected){
    var matched = Spec.Matcher.find(matcher)(expected,this);
    if( !matched.result ) Spec.logger(matched.negative_failure_message)
  }
}


Spec.Matcher= { 
  find: function(name){
    if(Spec.Matchers[name]) {
      return Spec.Matchers[name];
    } else {
      throw 'missing matcher: "'+name+'"'
    }
  }
}
Spec.Matchers = {
    '==': function(expected,returned) {
      return {result: expected == returned,
      failure_message: ' expected '+ returned  + ' to equal ' + expected,
      negative_failure_message: ' expected '+ returned  + ' not to equal ' + expected
      }
    },
    'have_key': function(expected_key,returned){
      var result = false
      for (var property in returned){
        if (property==expected_key) result = true
      }
      return {result:result,
        failure_message: 'expected ' + returned + ' to have key '+ expected_key,
        negative_failure_message: 'expected ' + returned + ' not to have key '+ expected_key
      }
    }
  }




Spec.logger = function(msg){ if(!this.in_example) document.write('<br>');document.write(msg); }

Spec.use_wrapper=function(){
  Spec.using_wrapper = true;
}


describe = Spec;

