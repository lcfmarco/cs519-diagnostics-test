import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem } from "@mui/material";
/**
 * You will find globals from this file useful!
 */
import {} from "./globals"; 
import { IUniversityClass} from "./types/api_types";
import { GradeTable } from "./components/GradeTable"; // Importing GradeTable.tsx component to App file
import { calcAllFinalGrade, fetchClassById, fetchStudentDetails} from "./utils/calculate_grade";


type TransformedGrade = {
  id: string;
  studentName: string;
  finalGrade: number;
};

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [grades, setGrades] = useState<TransformedGrade[]>([]);

  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */
  // const fetchSomeData = async () => {
  //   const res = await fetch("https://cat-fact.herokuapp.com/facts/", {
  //     method: "GET",
  //   });
  //   const json = await res.json();
  //   console.log(json);
  // };

  // Fetching the classes of fall2022 for our drop down menu
  useEffect(() => { 
    const fetchClasses = async () => {
      const headers = {
        'Accept': 'application/json',
        'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==' // Token in globals.ts (ideally I pass it from globals)
      };
      const url = `https://spark-se-assessment-api.azurewebsites.net/api/class/listBySemester/fall2022?buid=U22651662`; // According to API, we should only query fall 2022 classes
      try {
        const response = await fetch(url,
          {
            method: 'GET',
            headers: headers
          });
        if (response.ok) {
          const classes = await response.json();
          setClassList(classes);
        } else {
          // Error (only status code avaliable is 401)
          console.error('Failed to fetch classes:', response.statusText);
        }
      } catch (error) {
        // Handle any exceptions from fetching
        console.error('Error fetching class list:', error);
      }
    };
    fetchClasses();
  }, []);

  // Calling necessary functions and fetching necessary information that will fill the data into our grade table column
  const fetchAndSetStudentGrades = async (classID: string) => {
    try {
      const studentGrades = await calcAllFinalGrade(classID); // Calculating the list of final grades for the chosen class
      const classDetails = await fetchClassById(classID); // Fetching the class details of the class for the grades table

      const combinedData = await Promise.all(studentGrades.map(async (grade) => {
        // Fetch individual student details based on the student id of a given grade (so we can link the grade reflected on the table to a student)
        const studentDetails = await fetchStudentDetails(grade.id);
        return {
          id: studentDetails[0].universityId,
          studentName: studentDetails[0].name,
          finalGrade: grade.finalGrade,
          classId: classDetails.classId,
          className: classDetails.title,
          semester: classDetails.semester
        };
      }));
      
      setGrades(combinedData); // Set the grades variable as combined data
    } catch (error) {
      console.error("Error fetching and setting student grades:", error);
    }
  };  

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            <Select fullWidth={true}
            label="Class" 
            onChange={(event) => {
              const selectedClassID = event.target.value as string;
              setCurrClassId(event.target.value as string);
              fetchAndSetStudentGrades(selectedClassID);
            }
              } 
              value={currClassId}>
              {/* You'll need to place some code here to generate the list of items in the selection */}
              {classList.map((universityClass) => (
                <MenuItem key={universityClass.classId} value={universityClass.classId}>
                  {universityClass.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          {/* <div>Place the grade table here</div> */}
          <GradeTable grades={grades} /> {/* Displaying the GradeTable */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
