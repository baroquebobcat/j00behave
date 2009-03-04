Spec = function(specs,opts){
/*  var name = Object.isString(arguments[0]) ? :''
  var specs = name != '' ? arguments[1] : arguments[0]*/
  //set up environment
  // apply prototypal methods, if used
  if (!this.using_wrapper)
  {
    Object.extend(Object.prototype,Spec.Expectations)
  }else
  {
    window[this.wrapper_name] = function(res){Object.extend(res,Spec.Expectations)}
  }
   function isExpectation(prop){
     if (Spec.Expectations[prop]) return true;
   }
 for (var property in specs) {
   
   if(!isExpectation(property))
   {
     var example = specs[property]
     //write out some stuff
     Spec.logger(property)
     //-------------------
     if (typeof example =="function") {
       Spec.enter_example();
       example();
       Spec.logger('.');
       Spec.exit_example()
     }
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
Spec.Example=function(name,body){
  this.name=name;
  this.body=body;
//  this.success
//  this.expectations;
}
Spec.Example.prototype.run=function(){
  this.body()
}




Spec.Expectations = {
  should: function (match_key,expected){
    var matcher = Spec.Matcher.find(match_key)(this,expected);
    if( !matcher.matched ) Spec.logger('<span style="color:red">'+matcher.failure_message+'</span>')
  },
  should_not: function (match_key,expected){
    var matcher = Spec.Matcher.find(match_key)(this,expected);
    if( matcher.matched ) Spec.logger('<span style="color:red">'+matcher.negative_failure_message+'</span>')
  },
  should_throw_error_from: function(method){
    this['expect this to throw error '+method] = this[method]
    this[method]= function(){
      try{
        this['expect this to throw error '+method].apply(this,arguments);
        throw 'should have thrown error';
      }catch (e){
        if (e =='should have thrown error')
          Spec.logger('should have thrown error')
//        else
      }
      
    }
  }
}


Spec.Matcher= { 
  find: function(name){
    if(Spec.Matchers[name]) {
      return Spec.Matchers[name];
    } else {
      throw 'missing matcher: "'+name+'"'
    }
  },
  
}
Spec.Matchers = {
    '==': function(received,expected) {
      return {
        matched: expected == received,
        failure_message: ' expected '+ received  + ' to == ' + expected,
        negative_failure_message: ' expected '+ received  + ' not to == ' + expected
      }
    },
    '<':function(received,greater){
      return {
        matched: received < greater,
        failure_message: ' expected '+received+' to be less than '+greater+' but wasn\'t',
        negative_failure_message: ' expected '+ received  + ' not to be less than ' + greater
      }
    },
    '>':function(received,lesser){
      return {
        matched: received < greater,
        failure_message: ' expected '+received+' to be greater than '+lesser+' but wasn\'t',
        negative_failure_message: ' expected '+ received  + ' not to be greater than ' + lesser
      }
    },
    'be_null':function(received){
      return {
        matched: received === null,
        failure_message: ' expected '+ received  + ' to be null but wasn\'t.',
        negative_failure_message: ' expected '+ received  + ' not to be null, but was.'
      }
    },
    'have_key': function(expected_key,received){
      var result = false
      for (var property in received){
        if (property==expected_key) result = true
      }
      return {matched:result,
        failure_message: 'expected ' + received + ' to have key '+ expected_key,
        negative_failure_message: 'expected ' + received + ' not to have key '+ expected_key
      }
    }
  }




Spec.logger = function(msg){ if(!this.in_example) document.write('<br>');document.write(msg); }

Spec.use_wrapper=function(){
  Spec.using_wrapper = true;
}


describe = Spec;

