//Wang Jian
//CSE270E
//2017 Jan 14
//Assignmnet10
module.exports = {
       index: function(req, res){
           //if there is session id, then render to timer page
           //and clear session
           if(req.session.userid){
             res.render('timer', {username: req.session.userid});
             req.session.userid = '';
           }else{
             //if no session id, direct to home page
             res.render('main');
           }
       },
       about: function(req, res) {
           res.render('about');
       },
       login: function(req, res) {
           res.render('login');
       },
       loginsubmit: function(req,res) {
         //store data
         data = req.body;
         //check if there are username, password and password is test
         if(data.usr && data.pwd && data.pwd == 'test'){
            //if true, then set session id to username
            req.session.userid = data.usr;
            //redirect to timer page
            res.redirect('/');
         }else{
            //if false, set up error message and render to login page
            var model = {'errormsg':"Invalid username or password"};
            res.render('login',model);
         }
       }
};
