var PointClicked = 0;
var ExperimentPoints={};

/**
 * Clear the canvas and the calibration button.
 */
function ExperimentClearCanvas(){
  $(".Experiment").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function StartExperiment(){
  document.getElementById("experiment").hidden = false;
}
/**
 * Show the instruction of using calibration at the start up screen.
 */
function ExperimentPopUpInstruction(){
    ExperimentClearCanvas();
  swal({
    title:"Experiment",
    text: "Bitte auf einen Punkt schauen und einmal drauf klicken bis der Punkt verschwindet. ",
    buttons:{
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowExperimentPoint();
  });

}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
$(document).ready(function(){
    ExperimentClearCanvas();
     $(".Experiment").click(function(){ // click event on the calibration buttons

      var id = $(this).attr('id');

      if (!ExperimentPoints[id]){ // initialises if not done
        ExperimentPoints[id]=0;
      }
      ExperimentPoints[id]++; // increments values

      if (ExperimentPoints[id]==5){ //only turn to yellow after 5 clicks
        $(this).css('background-color','yellow');
        $(this).prop('disabled', true); //disables the button
        PointClicked++;
      }else if (ExperimentPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2*ExperimentPoints[id]+0.2;
        $(this).css('opacity',opacity);
      }

      //Show the middle calibration point after all other points have been clicked.
      if (PointClicked == 8){
        $("#EPt5").show();
      }

      if (PointClicked >= 9){ // last point is calibrated
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            $(".Experiment").hide();
            $("#EPt5").show();

            // clears the canvas
            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            
          }
    });
});

/**
 * Show the Calibration Points
 */
function ShowExperimentPoint() {
  $(".Experiment").show();
  $("#EPt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
function ClearExperiment(){
  // Clear data from WebGazer

  $(".Experiment").css('background-color','red');
  $(".Experiment").css('opacity',0.2);
  $(".Experiment").prop('disabled',false);

  ExperimentPoints = {};
  PointClicked = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
