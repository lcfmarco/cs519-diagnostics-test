import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { IGradeTableProps, IUniversityClass, IAssignment, IGrades, IStudent } from "../types/api_types";

/**
 * You might find it useful to have some dummy data for your own testing.
 * Feel free to write this function if you find that feature desirable.
 * 
 * When you come to office hours for help, we will ask you if you have written
 * this function and tested your project using it.
 */
export function dummyData() {
  return [];
}

/**
 * This is the component where you should write the code for displaying the
 * the table of grades.
 *
 * You might need to change the signature of this function.
 *
 */

export const GradeTable: React.FC<IGradeTableProps> = ({ grades }) => {

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Student ID', width: 110 },
    { field: 'studentName', headerName: 'Student Name', width: 130 },
    { field: 'classId', headerName: 'Class ID', width: 110 },
    { field: 'className', headerName: 'Class Name', width: 110 },
    { field: 'semester', headerName: 'Semester', width: 110 },
    {
      field: 'finalGrade',
      headerName: 'Final Grade',
      type: 'number',
      width: 110,
      align: 'left',
      headerAlign: 'left',
    },
  ];



  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={grades}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};