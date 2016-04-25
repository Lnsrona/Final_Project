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
     var today = new Date();
     if (Meeting.days.length==0) {
     	for (var i=-3; i<=3; i++) {
     		var tmpDate = new Date((today/1000+i*86400)*1000);
     		Meeting.addDay(tmpDate.getFullYear(),tmpDate.getMonth(),tmpDate.getDate());
     	}
     }
     var currentDate = 3;
     $scope.activities = Meeting.days[currentDate]._activities;
     $scope.startTime = Meeting.days[currentDate].getStart();
     $scope.totalLength = function() {
     	return Meeting.days[currentDate].getTotalLength();
     }
     $scope.endTime = function() {
     	return Meeting.days[currentDate].getEnd();
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
     		$scope.startTime = Meeting.days[currentDate].getStart();
     		return;
     	}
     	if (flag==1) {
     		if (isNaN($scope.startTime[0]) || isNaN($scope.startTime[2]) || $scope.startTime.length>4) {
     			$scope.startTime = Meeting.days[currentDate].getStart();
     			return;
     		}
     		if ($scope.startTime.length==4) {
     			if (isNaN($scope.startTime[3])) {
     				$scope.startTime = Meeting.days[currentDate].getStart();
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
     			$scope.startTime = Meeting.days[currentDate].getStart();
     			return;
     		}
     		if ($scope.startTime.length==5) {
     			if (isNaN($scope.startTime[4])) {
     				$scope.startTime = Meeting.days[currentDate].getStart();
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
     		$scope.startTime = Meeting.days[currentDate].getStart();
     		return;
     	}
     	Meeting.days[currentDate].setStart(hour,min);
     	$scope.startTime = Meeting.days[currentDate].getStart();
     }
     $scope.changeDate = function (x) {
     	if (x==0 && currentDate>0) {
     		currentDate--;
     		$scope.activities = Meeting.days[currentDate]._activities;
     		$scope.startTime = Meeting.days[currentDate].getStart();
     	}
     	if (x==1 && currentDate<6) {
     		currentDate++;
     		$scope.activities = Meeting.days[currentDate]._activities;
     		$scope.startTime = Meeting.days[currentDate].getStart();
     	}
     }
     $scope.getActivityTime = function(position) {
     	var activityTime = Meeting.days[currentDate]._start;
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
     $scope.dateDisplay = function () {
     	if (Meeting.days[currentDate]._month == today.getMonth() && Meeting.days[currentDate]._day == today.getDate()) {
     		return Meeting.days[currentDate]._monthDisplay + " " + Meeting.days[currentDate]._dayDisplaiy + " (Today)";
     	}
     	else {
     		return Meeting.days[currentDate]._monthDisplay + " " + Meeting.days[currentDate]._dayDisplaiy;
     	}
     }
     $scope.removeActivity = function(position) {
     	Meeting.days[currentDate]._removeActivity(position);
     	if (position == chosenPosition) {
     		$scope.name = "";
     		$scope.duration = undefined;
     		$scope.type = "Type: Presentation";
     		$scope.description = "";
     		$scope.addActi = false;
     		$scope.modeTitle = "+ Add activity";
     		editMode=0;
     	}
     }
     $scope.removeParkedActivity = function(position) {
     	Meeting.removeParkedActivity(position);
     }
     $scope.moveParkedToDay = function (activity,position) {
     	Meeting.addActivity(activity,currentDate);
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
     		Meeting.days[currentDate]._activities[chosenPosition].setName($scope.name);
     		Meeting.days[currentDate]._activities[chosenPosition].setLength($scope.duration);
     		Meeting.days[currentDate]._activities[chosenPosition].setTypeId(typeID);
     		Meeting.days[currentDate]._activities[chosenPosition].setDescription($scope.description);
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


});
