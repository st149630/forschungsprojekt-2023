var PointClicked = 0;
var ExperimentPoints={};
var data = []

/**
 * Clear the canvas and the calibration button.
 */
function ExperimentClearCanvas(){
  $(".Experiment").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function StartExperiment(){
  ClearExperiment();
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
     $(".Experiment").click(async function(){ // click event on the experiment buttons
     
      experimentClick();
      var id = $(this).attr('id');
      var element = document.getElementById(id);
      

      if (!ExperimentPoints[id]){ // initialises if not done
        ExperimentPoints[id]=0;
      }
      var opacity = 0.5;
      $(this).css('opacity',opacity);
      await sleep(5000)
      ExperimentPoints[id]++; // increments values

      if (ExperimentPoints[id]==1){ 
        $(this).css('background-color','red');
        $(this).prop('disabled', true); //disables the button
        PointClicked++;
        var _data = experimentClickDone({x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y});
        data.push(_data);
      }
      //Show the middle calibration point after all other points have been clicked.
      if (PointClicked == 8){
        $("#EPt5").show();
      }

      if (PointClicked >= 9){ // last point is clicked
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            data = JSON.stringify(data)
            var jsonObject = JSON.parse(data);
            var jsonContent = JSON.stringify(jsonObject);
            writeToFile(jsonContent, subject, _data.eyetracker);
            $(".Experiment").hide();

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
}

/**
* This function clears the calibration buttons memory
*/
function ClearExperiment(){
  // Clear data from WebGazer

  $(".Experiment").css('background-color','green');
  $(".Experiment").css('opacity',0.2);
  $(".Experiment").prop('disabled',false);

  ExperimentPoints = {};
  PointClicked = 0;
  data = [];
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
async function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function writeToFile(data, subject, name){

  // Store data in local storage
  localStorage.setItem(name, data);

  // Retrieve data from local storage
  const myData = JSON.parse(localStorage.getItem(name));

  // Save data to a file
  const dataBlob = new Blob([JSON.stringify(myData, null, 2)], {type: 'application/json'});
  const dataUrl = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${name}_${subject}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(dataUrl);
}
