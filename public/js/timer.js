//Wang Jian
//CSE270E
//Assignment10
//2017 Jan 14

//check whether if the timer is running, not running, pause or done
//show the button that should show up
function detectChange(state, e) {
        //Make sure all buttons is hidden at first
    $($(e).parent().children(".timerresume, .timerstop, .timerreset, .timerdone, .timerstart")).hide();
        //if state is 1 means running, then only show stop and prevent user change time again
    if (state == 1) { //running
        $($(e).parent().children(".timerstop")[0]).show();
        $($(e).parent().parent().find('.hours,.minutes,.seconds')).prop("disabled", true);
                //if state is 2 meanings pause, then only show resume and reset
    } else if (state == 2) { // pause
        $($(e).parent().children(".timerresume")[0]).show();
        $($(e).parent().children(".timerreset")[0]).show();
        $($(e).parent().parent().find('.hours,.minutes,.seconds')).prop("disabled", true);
                //if state is 3 meanings done, then only show done and change the background color
    } else if (state == 3) { // done
        $($(e).parent().children(".timerdone")[0]).show();
        $($(e).parent().parent().parent()).css("background", "red");
        $($(e).parent().parent().find('.hours,.minutes,.seconds')).prop("disabled", false);
        $($(e).parent().parent().find('.timerstart')).prop("disabled", true);
                //if state is 0 meanings not running, then only start and disable start button
    } else if (state == 0) { // not running
        $($(e).parent().children(".timerstart")[0]).show();
        $($(e).parent().parent().parent()).css("background", 'none');
        $($(e).parent().parent().find('.hours,.minutes,.seconds')).prop("disabled", false);
        $($(e).parent().parent().find('.timerstart')).prop("disabled", true);
    }
}
//clear events
function clearEventsExcept(eventName, index) {
    Object.keys(clickEvents).forEach(function (e) {
        if (e != eventName) {
            clickEvents[e][index] = undefined;
        }
    });
}


//initiate variables and event
var timers = [];
var intevals = [];
var clickEvents = {};
clickEvents['start'] = [];
clickEvents['stop'] = [];
clickEvents['resume'] = [];
clickEvents['reset'] = [];
clickEvents['done'] = [];
var emailreg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

//for loop to initiate each timer
for (var i = 0; i < 3; i++) {
    var newTimer = {timerName: i, doneTIme: 0, state: 0};
    newTimer.state = 1;
    timers.push(newTimer);
}

//Make sure the format of input is always in two digits
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

$(document).ready(function(){
   //in about page, if user click author, then show following words
   $('#auth').on('click', function(){
      document.getElementById('author').innerHTML = "Program written by Wang Jian";
   });
   //if user click course, it will show CSE270E
   $('#cour').on('click', function() {
      document.getElementById('course').innerHTML = "CSE270E";
   });
   //if submit is click, then it will post data to server
   //$('#sub').click(function(e) {
     //       var dataList = {};
       //     dataList['usr'] = $('#usr').val();
         //   dataList['pwd'] = $('#pwd').val();
           // $.post('http://172.17.29.68:3610/login', dataList, function(data) {
             //   console.log(data);
           // }); 
   //});
   //hide register error first
   $('#regError').hide();
   //if register submit button is clicked
   $('#reg').on('click', function(e){
        //check whether each field is filled
        var user = $('#usr').val();
        if($('#usr').val().length == 0){
           $('#regError').show();
           e.preventDefault();
        }else if($('#pwd').val().length == 0){
           $('#regError').show();
           e.preventDefault();
        }else if($('#pwd2').val().length == 0){
           $('#regError').show();
           e.preventDefault();
        }else if($('#email').val().length == 0){
           $('#regError').show();
           e.preventDefault();
        //check if two passwords are same
        }else if($('#pwd').val() != $('#pwd2').val()){
           $('#regError').show();
           e.preventDefault();
        //check email is in correct pattern
        }else if(!$('#email').val().match(emailreg)){
           $('#regError').show();
           e.preventDefault();
        }else{
         
        }

   });
//limit user can only type numbers
    $('.hours,.minutes,.seconds').keypress(function (e) {
        if (e.keyCode < 48 || e.keyCode > 57) {
            return false;
        }
    });

	//user can't press start if not entering specific number
    $('.timerstart').prop("disabled", true);

	//if there is anything change to secongs hours or minutes then start button can be clicked
    $('.seconds,.minutes,.hours').change(function (e) {
		//get each input
        var hourInput = $($(this).parent().children(".hours")[0]);
        var minuteInput = $($(this).parent().children(".minutes")[0]);
        var secondInput = $($(this).parent().children(".seconds")[0]);

		//if user did not input anything, then initialize it to 00
        if (hourInput.val() == '') hourInput.val('00');
        if (minuteInput.val() == '') minuteInput.val('00');
        if (secondInput.val() == '') secondInput.val('00');

		//parse to integer
        var hr = parseInt(hourInput.val());
        var min = parseInt(minuteInput.val());
        var sec = parseInt(secondInput.val());

		//calculate the total seconds
        var totalSecond = hr * 3600 + min * 60 + sec;

		//set each value
        hourInput.val(pad(Math.floor(totalSecond / 3600), 2));
        minuteInput.val(pad(Math.floor(totalSecond % 3600 / 60), 2));
        secondInput.val(pad(Math.round(totalSecond % 3600 % 60), 2));

		//if no input, then button is disabled, otherwise is active
        if (parseInt(hourInput.val()) == 0 && parseInt(minuteInput.val()) == 0 && parseInt(secondInput.val()) == 0) {
            $($(this).parent().parent().find(".timerstart")[0]).prop("disabled", true);
        } else {
            $($(this).parent().parent().find(".timerstart")[0]).prop("disabled", false);
        }
    });

	//hide all other buttons except start at first
    $(".timerresume, .timerstop, .timerreset, .timerdone").hide();

    //if any start button is clicked
    $('.timerstart').click(function (e) {
	//prevent click it again
        e.preventDefault();
		//find which button is clicked among three
        var element = this;
		//get which timer is clicked
        var dataIndex = $(this).parent().parent().parent().attr("data-index");

		
        if (clickEvents['start'][dataIndex]) {
            return;
        }

        clickEvents['start'][dataIndex] = e;

		//get element of which hours, minutes and seconds are changed among 3 timer
        var hour = $($(this).parent().parent().children(".panel-body")[0]).children(".hours");
        var minute = $($(this).parent().parent().children(".panel-body")[0]).children(".minutes");
        var second = $($(this).parent().parent().children(".panel-body")[0]).children(".seconds");

		//change the state to be 1 which means running
        timers[dataIndex].state = 1;
		//call detectChange function to hide and show specific button 
        detectChange(timers[dataIndex].state, element);
		//clear all other envents except start
        clearEventsExcept('start', dataIndex);

		//get the done time for that timers and show it in format
        timers[dataIndex].doneTIme = $.now() + (parseInt(hour.val()) * 3600 + parseInt(minute.val()) * 60 + parseInt(second.val())) * 1000;
        var datetime = new Date(timers[dataIndex].doneTIme);
        $($($(this).parent().parent().children(".panel-body")[0]).find(".doneat")[0]).text(pad(datetime.getHours(), 2) + ":" + pad(datetime.getMinutes(), 2) + ":" + pad(datetime.getSeconds(), 2));

		//keep showing the time after each seconds and detect if it is at done time
        intevals[dataIndex] = setInterval(function () {
			//find time left and calculate hours minutes and seconds
            var timeLeft = Math.round((timers[dataIndex].doneTIme - $.now()) / 1000);
            hour.val(pad(Math.floor(timeLeft / 3600), 2));
            minute.val(pad(Math.floor((timeLeft % 3600) / 60), 2));
            second.val(pad(Math.round(timeLeft % 3600 % 60), 2));

			//if it is at done time now, then set state to 3 which is done and change button that show up and stop the time
            if ($.now() >= timers[dataIndex].doneTIme) {
                timers[dataIndex].state = 3;
                detectChange(timers[dataIndex].state, element);
                clearInterval(intevals[dataIndex]);
            }
        }, 1000);
    });

	//if done button is clicked
    $('.timerdone').click(function (e) {
		//find which element is clicked
        var element = this;
		//find number of timer
        var dataIndex = $(this).parent().parent().parent().attr("data-index");
        if (clickEvents['done'][dataIndex]) {
            return;
        }
        clickEvents['done'][dataIndex] = e;
		
		//set done at to blank
        $($($(this).parent().parent().children(".panel-body")[0]).find(".doneat")[0]).text('');
		//change state to 0
        timers[dataIndex].state = 0;
		//change button showed up
        detectChange(timers[dataIndex].state, element);
		//clear all other events except done
        clearEventsExcept('done', dataIndex);
		//clear timer name
        $($(this).parent().parent().find('.timername')[0]).val('');
    });

	//if stop is clicked
    $('.timerstop').click(function (e) {
		//find which element is clicked
        var element = this;
		//find number of timer
        var dataIndex = $(this).parent().parent().parent().attr("data-index");
        if (clickEvents['stop'][dataIndex]) {
            return;
        }
		
        clickEvents['stop'][dataIndex] = e;
		//change state to 2 means pause
        timers[dataIndex].state = 2;
		//change the button should show and hide
        detectChange(timers[dataIndex].state, element);
		//stop the time
        clearInterval(intevals[dataIndex]);
		//clear all other events except done
        clearEventsExcept('stop', dataIndex);
    });

	// if reset is clicked
    $('.timerreset').click(function (e) {
		//find which element is clicked
        var element = this;
		//reset all the input for time
        var hour = $($(this).parent().parent().children(".panel-body")[0]).children(".hours").val('0');
        var minute = $($(this).parent().parent().children(".panel-body")[0]).children(".minutes").val('00');
        var second = $($(this).parent().parent().children(".panel-body")[0]).children(".seconds").val('00');

		//find number of timer
        var dataIndex = $(this).parent().parent().parent().attr("data-index");
        if (clickEvents['reset'][dataIndex]) {
            return;
        }
        clickEvents['reset'][dataIndex] = e;
		//clear done at
        $($($(this).parent().parent().children(".panel-body")[0]).find(".doneat")[0]).text('');
		//change state to 0 which means not running
        timers[dataIndex].state = 0;
		//change the button should show and hide
        detectChange(timers[dataIndex].state, element);
		//clear all other events except reset
        clearEventsExcept('reset', dataIndex);
	    //clear timer name
        $($(this).parent().parent().find('.timername')[0]).val('');
    });

	//if resume is clicked
    $('.timerresume').click(function (e) {
		//find which element is clicked
        var element = this;
		//get times that user input
        var hour = $($(this).parent().parent().children(".panel-body")[0]).children(".hours");
        var minute = $($(this).parent().parent().children(".panel-body")[0]).children(".minutes");
        var second = $($(this).parent().parent().children(".panel-body")[0]).children(".seconds");
		//find number of timer
        var dataIndex = $(this).parent().parent().parent().attr("data-index");
        if (clickEvents['resume'][dataIndex]) {
            return;
        }
        clickEvents['resume'][dataIndex] = e;
		//calculatet he done time and show it with format
        timers[dataIndex].doneTIme = $.now() + (parseInt(hour.val()) * 3600 + parseInt(minute.val()) * 60 + parseInt(second.val())) * 1000;
        var datetime = new Date(timers[dataIndex].doneTIme);
        $($($(this).parent().parent().children(".panel-body")[0]).find(".doneat")[0]).text(pad(datetime.getHours(), 2) + ":" + pad(datetime.getMinutes(), 2) + ":" + pad(datetime.getSeconds(), 2));
		
		//change state to 1 which is running
        timers[dataIndex].state = 1;
		//change the button should show and hide
        detectChange(timers[dataIndex].state, element);
		//clear all other events except resume
        clearEventsExcept('resume', dataIndex);
		//keep showing the time after each seconds and detect if it is at done time
        intevals[dataIndex] = setInterval(function () {
			//calculate time left with formate
            var timeLeft = Math.round((timers[dataIndex].doneTIme - $.now()) / 1000);
            hour.val(pad(Math.floor(timeLeft / 3600), 2));
            minute.val(pad(Math.floor((timeLeft % 3600) / 60), 2));
            second.val(pad(Math.round(timeLeft % 3600 % 60), 2));
			//detect if it is done time now
            if ($.now() >= timers[dataIndex].doneTIme) {
				//change state to 3 which is done
                timers[dataIndex].state = 3;
				//change the button should show and hide
                detectChange(timers[dataIndex].state, element);
				//stop the time
                clearInterval(intevals[dataIndex]);
            }
        }, 1000);
    });   

});;
