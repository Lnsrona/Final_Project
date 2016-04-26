meetingPlannerApp.controller('homeCtrl', function ($scope, Meeting) {
     $scope.addActi = false;
     $scope.modeTitle = "+ Add activity";
     $scope.name = "";
     $scope.duration = undefined;
     $scope.type = "Type: Presentation";
     $scope.description = "";
     $scope.parkedActivities = Meeting.parkedActivities;
     var chosenPosition;
     var editMode = 0;
     var drawCanvas = function() {
          var height = new Array(4);
          var canvasHeight = 80;
          var canvasWidth = 60;
          var getCanvas = document.getElementById("myCanvas");
          var myCanvas = getCanvas.getContext("2d");
          var currentY=0;
          if (Meeting.days[CurrentDate].getTotalLength()) {
               for (var i=0; i<4; i++) {
                    if (Meeting.days[CurrentDate].getLengthByType(i)) {
                         height[i] = canvasHeight * Meeting.days[CurrentDate].getLengthByType(i) / Meeting.days[CurrentDate].getTotalLength();
                    }
                    else {
                         height[i] = 0;
                    }
               }
          }
          else {
               myCanvas.clearRect(0,0,canvasWidth+20,canvasHeight);
               myCanvas.fillStyle = "#000000";
               myCanvas.fillRect(10,0,canvasWidth,canvasHeight);
               return;
          }
          for (var i=0; i<4; i++) {
               myCanvas.clearRect(10,currentY,canvasWidth,height[i]);
               myCanvas.fillStyle=ColorType[i];
               myCanvas.fillRect(10,currentY,canvasWidth,height[i]);
               currentY += height[i];
          }
          currentY = canvasHeight * 0.7;
          myCanvas.strokeStyle = "red";
          myCanvas.moveTo(0,currentY);
          myCanvas.lineTo(canvasWidth+20,currentY);
          myCanvas.stroke();
     }

     var today = new Date();
     if (Meeting.days.length==0) {
     	for (var i=-3; i<=3; i++) {
     		var tmpDate = new Date((today/1000+i*86400)*1000);
     		Meeting.addDay(tmpDate.getFullYear(),tmpDate.getMonth(),tmpDate.getDate());
     	}
          drawCanvas();
     }
     $scope.activities = Meeting.days[CurrentDate]._activities;
     $scope.startTime = Meeting.days[CurrentDate].getStart();
     $scope.dateDisplay = function () {
          if (CurrentDate == 3) {
               return Meeting.days[CurrentDate]._monthDisplay + " " + Meeting.days[CurrentDate]._dayDisplaiy + " (Today)";
          }
          else if (CurrentDate == 0) {
               return Meeting.days[CurrentDate]._monthDisplay + " " + Meeting.days[CurrentDate]._dayDisplaiy + " (Min)";
          }
          else if (CurrentDate == 6) {
               return Meeting.days[CurrentDate]._monthDisplay + " " + Meeting.days[CurrentDate]._dayDisplaiy + " (Max)";
          }
          else {
               return Meeting.days[CurrentDate]._monthDisplay + " " + Meeting.days[CurrentDate]._dayDisplaiy;
          }
     }

     $scope.totalLength = function() {
     	return Meeting.days[CurrentDate].getTotalLength();
     }
     $scope.endTime = function() {
     	return Meeting.days[CurrentDate].getEnd();
     }
     $scope.changeDate = function (x) {
     	if (x==0 && CurrentDate>0) {
     		CurrentDate--;
     		$scope.activities = Meeting.days[CurrentDate]._activities;
     		$scope.startTime = Meeting.days[CurrentDate].getStart();
               drawCanvas();
     	}
     	if (x==1 && CurrentDate<6) {
     		CurrentDate++;
     		$scope.activities = Meeting.days[CurrentDate]._activities;
     		$scope.startTime = Meeting.days[CurrentDate].getStart();
               drawCanvas();
     	}
     }
     $scope.getActivityTime = function(position) {
     	var activityTime = Meeting.days[CurrentDate]._start;
     	var hours, minutes;
     	for (var i=0; i<position; i++) {
     		activityTime += $scope.activities[i].getLength();
     	}
     	hours = Math.floor(activityTime/60);
     	minutes = activityTime % 60;
		if (hours>23) {
			hours = 23;
			minutes = 59;
		}
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
     	return hours + ":" + minutes;
     }
     $scope.removeActivity = function(position) {
     	Meeting.days[CurrentDate]._removeActivity(position);
     	if (position == chosenPosition) {
     		$scope.name = "";
     		$scope.duration = undefined;
     		$scope.type = "Type: Presentation";
     		$scope.description = "";
     		$scope.addActi = false;
     		$scope.modeTitle = "+ Add activity";
     		editMode=0;
     	}
          drawCanvas();
     }
     $scope.removeParkedActivity = function(position) {
     	Meeting.removeParkedActivity(position);
     }
     $scope.setType = function(btnType) {
     	$scope.type = btnType;
     }
     $scope.editActivity = function(position, mode) {
     	editMode = mode;
     	chosenPosition = position;
     	$scope.addActi = true;
     	$scope.modeTitle = "Edit activity";
     	if (mode == 1) {
     		$scope.name = $scope.activities[position].getName();
     		$scope.duration = $scope.activities[position].getLength();
     		$scope.type = "Type: " + $scope.activities[position].getType();
     		$scope.description = $scope.activities[position].getDescription();
     	}
     	if (mode == 2) {
     		$scope.name = Meeting.parkedActivities[position].getName();
     		$scope.duration = Meeting.parkedActivities[position].getLength();
     		$scope.type = "Type: " + Meeting.parkedActivities[position].getType();
     		$scope.description = Meeting.parkedActivities[position].getDescription(); 
     	}
     }
     $scope.btnSave = function(position) {
     	if ($scope.name == "") {
     		document.getElementById("nameInput").focus();
     		return;
     	}
     	if (isNaN($scope.duration) || $scope.duration=='') {
     		document.getElementById("lengthInput").focus();
     		return;
     	}
     	var typeID;
     	if ($scope.type == "Type: Presentation") {
     		typeID = 0;
     	}
     	else if ($scope.type == "Type: Discussion") {
     		typeID = 1;
     	}
     	else if ($scope.type == "Type: Group Work") {
     		typeID = 2;
     	}
     	else {
     		typeID = 3;
     	}
     	if (editMode ==1) {
     		Meeting.days[CurrentDate]._activities[chosenPosition].setName($scope.name);
     		Meeting.days[CurrentDate]._activities[chosenPosition].setLength($scope.duration);
     		Meeting.days[CurrentDate]._activities[chosenPosition].setTypeId(typeID);
     		Meeting.days[CurrentDate]._activities[chosenPosition].setDescription($scope.description);
               drawCanvas();
     	}
     	else if (editMode ==2) {
     		Meeting.parkedActivities[chosenPosition].setName($scope.name);
     		Meeting.parkedActivities[chosenPosition].setLength($scope.duration);
     		Meeting.parkedActivities[chosenPosition].setTypeId(typeID);
     		Meeting.parkedActivities[chosenPosition].setDescription($scope.description);
     	}
     	else {
     		Meeting.addParkedActivity(new Activity($scope.name,$scope.duration,typeID,$scope.description));
     	}
     	$scope.name = "";
     	$scope.duration = undefined;
     	$scope.type = "Type: Presentation";
     	$scope.description = "";
     	$scope.addActi = false;
     	$scope.modeTitle = "+ Add activity";
     	editMode=0;
     }
     $scope.btnCancel = function() {
     	$scope.name = "";
     	$scope.duration = undefined;
     	$scope.type = "Type: Presentation";
     	$scope.description = "";
     	$scope.addActi = false;
     	$scope.modeTitle = "+ Add activity";
     	editMode=0;
     }
     $scope.setStart = function() {
          var flag = 0;
          var hour, min;
          for (var i=0; i<$scope.startTime.length; i++) {
               if ($scope.startTime[i]==":") {
                    flag = i;
                    break;
               }
          }
          if (flag==0 || flag>2) {
               $scope.startTime = Meeting.days[CurrentDate].getStart();
               return;
          }
          if (flag==1) {
               if (isNaN($scope.startTime[0]) || isNaN($scope.startTime[2]) || $scope.startTime.length>4) {
                    $scope.startTime = Meeting.days[CurrentDate].getStart();
                    return;
               }
               if ($scope.startTime.length==4) {
                    if (isNaN($scope.startTime[3])) {
                         $scope.startTime = Meeting.days[CurrentDate].getStart();
                         return;
                    }
                    min = parseInt($scope.startTime[2] + "" + $scope.startTime[3]);
               }
               else {
                    min = parseInt($scope.startTime[2]);
               }
               hour = $scope.startTime[0];
          }
          if (flag==2) {
               if (isNaN($scope.startTime[0]) || isNaN($scope.startTime[1]) || isNaN($scope.startTime[3])) {
                    $scope.startTime = Meeting.days[CurrentDate].getStart();
                    return;
               }
               if ($scope.startTime.length==5) {
                    if (isNaN($scope.startTime[4])) {
                         $scope.startTime = Meeting.days[CurrentDate].getStart();
                         return;
                    }
                    min = parseInt($scope.startTime[3] + "" + $scope.startTime[4]);
               }
               else {
                    min = parseInt($scope.startTime[3]);
               }
               hour = parseInt($scope.startTime[0] + "" + $scope.startTime[1]);
          }
          if (hour>23 || min>59) {
               $scope.startTime = Meeting.days[CurrentDate].getStart();
               return;
          }
          Meeting.days[CurrentDate].setStart(hour,min);
          $scope.startTime = Meeting.days[CurrentDate].getStart();
     }
     $scope.onDrop = function(index, type, data){
          var newPosition = index;
          var newType = type;
          var oldType = data[0];
          var oldPosition = data[1];
          if (newPosition==-1) {
               if (type=="P") {
                    newPosition = Meeting.parkedActivities.length;
               }
               else {
                    newPosition = $scope.activities.length;
               }
          }
          for (var i=2; i<data.length; i++) {
               oldPosition += data[i];
          }
          if (oldType =="P" && newType=="P") {
               Meeting.moveActivity(null,oldPosition,null,newPosition);
          }
          else if (oldType=="P" && newType=="D") {
               Meeting.moveActivity(null,oldPosition,CurrentDate,newPosition);
               drawCanvas();
          }
          else if (oldType=="D" && newType=="D") {
               Meeting.moveActivity(CurrentDate,oldPosition,CurrentDate,newPosition);
          }
          else {
               Meeting.moveActivity(CurrentDate,oldPosition,null,newPosition);
               drawCanvas();
          }
     }
});
