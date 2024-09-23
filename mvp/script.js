    function getDates() { //gets the first and last days of class
        let firstDay = document.getElementById("first_day").value;
        let lastDay = document.getElementById("last_day").value;
        let classTime = document.getElementById("class_time").value;

        let firstDateTime = new Date(`${firstDay}T${classTime}`);
        let lastDateTime = new Date(`${lastDay}T${classTime}`);

        return [firstDateTime, lastDateTime];
    }

    function getClassDays() { //gets the days of the week class will be held
        let days_of_class = [];
        days_of_class[0] = document.getElementById("sunday").checked;
        days_of_class[1] = document.getElementById("monday").checked;
        days_of_class[2] = document.getElementById("tuesday").checked;
        days_of_class[3] = document.getElementById("wednesday").checked;
        days_of_class[4] = document.getElementById("thursday").checked;
        days_of_class[5] = document.getElementById("friday").checked;
        days_of_class[6] = document.getElementById("saturday").checked;
        return days_of_class;
    }

    function getSelectedClassDays() { // generates all days classes will be held using first/last days and selected week days
        let [firstDay, lastDay] = getDates();
        let classDays = getClassDays();
        let selectedDays = [];

        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            let dayIndex = d.getDay(); // dayIndex is the weekday that d is. (0-6). 
            if (classDays[dayIndex]) { // classDays is an array of booleans. values are true on weekdays the user selceted.
                selectedDays.push(new Date(d)); // Add to the selected days array
            }
        }
        return selectedDays;
    }

    function toICSDateString(date) { // This function changes the date object to an ics accepted string
        // Format a Date object as YYYYMMDDTHHmmSSZ
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }

    function createICS() {
        // Get instructor, class name, and location
        let instructorName = document.getElementById("instructor_name").value;
        let className = document.getElementById("class_name").value;
        let location = document.getElementById("location").value;

        // Get selected class days
        let selectedDays = getSelectedClassDays();

        // basic .ics structure
        let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CourseCalenderSEC\n`;
        /*
        BEGIN:VCALENDAR - signifys the start of a calendar file.
        VERSION:2.0 - something about the version.
        PRODID - tells the software that created the file 
        */

        // Add events for each day of class
        selectedDays.forEach((day) => {
            let startTime = toICSDateString(day); // date obj -> ics accepted string
            let endTime = toICSDateString(new Date(day.getTime() + (60 * 60 * 1000))); // sends a date obj thats an hour after.

            icsContent += `BEGIN:VEVENT\n`;
            icsContent += `UID:${day.getTime()}@CourseCalender.com\n`; // Unique ID based on timestamp
            icsContent += `DTSTAMP:${toICSDateString(new Date())}\n`; // Time of event creation
            icsContent += `DTSTART:${startTime}\n`; // Event start time
            icsContent += `DTEND:${endTime}\n`; // Event end time
            icsContent += `SUMMARY:${className} with ${instructorName}\n`; // Event name
            icsContent += `LOCATION:${location}\n`; // Event location
            icsContent += `DESCRIPTION:Class with ${instructorName}\n`; // Event description
            icsContent += `END:VEVENT\n`;x``
        });

        icsContent += `END:VCALENDAR`;

        // Create and download the .ics file
        downloadFile(icsContent, 'schedule.ics');
    }

    function downloadFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("create_isp").addEventListener("click", createICS);
    });
