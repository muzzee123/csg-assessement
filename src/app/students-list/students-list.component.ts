import { Component, OnInit } from '@angular/core';
import { StudentsApiService } from '../services/students-api.service';
import { Students } from '../model/students-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit {
  studentForm: FormGroup;
  title = 'students-pwa';
  modalRef: NgbModalRef;
  submitted= false;

  isPresent : string[] = ['true', 'false'];
  dateRange : string[] =  ['Today', '90 Days'];
  students : Students[];
 

  result: any;

  constructor(private students_ApiService: StudentsApiService, private studentModel:Students, private fb: FormBuilder, private modalService: NgbModal) {
    this.createForm();
  }

  createForm(){

    this.studentForm = this.fb.group({
    studentName:['', Validators.required, Validators.max(20)],
    className:['', Validators.required],
    grade:['', Validators.required, Validators],
    createdDate:['', Validators.required],
    isPresent:['', Validators.required],
    dateRange:['', Validators.required]
  });
}

clearForm()
{
  this.studentForm.reset();
}

get f() { return this.studentForm.controls; }

  ngOnInit() {
    this.getStudents();
  }

  getStudents(){
    this.students_ApiService.getAll().subscribe((students)=>{
      this.students = students;
      console.log(students);
     }, (err) => {
       console.log(err);
    });
  }

  addNewStudent(content){
    // Opens The Modal Form to add new Student
    this.modalRef  = this.modalService.open(content, { size: 'lg' });
   }

   getReport(content1){
    // Opens The Modal Form to add new Student
    this.modalRef  = this.modalService.open(content1, { size: 'lg' });
   }

  addStudent(studentName, className, grade, isPresent){
    this.submitted = true;
    this.studentModel.studentName = studentName;
    this.studentModel.className = className;
    this.studentModel.grade = grade;
    this.studentModel.isPresent = isPresent;
    this.students_ApiService.addStudent(this.studentModel).subscribe(
       data => {
        this.modalRef.close();
        this.getStudents();
       },error => {
        alert('Failed to add Student');
        this.modalRef.close();
      },() =>{
        alert('Student Successfully Added');
        this.modalRef.close();
        this.getStudents();
      }
    );
  }

  getDailyReport(className, dateRange){
    this.submitted = true;
    this.students_ApiService.getReport(className, dateRange).subscribe(
       data => {
        this.result = data;
        if(dateRange == 'Today'){
          this.excelReportToday(this.result);
        }
        else{
          this.excelReportTerm(this.result);
        }
       
        this.modalRef.close();
        this.getStudents();
       },error => {
        alert('Failed To Generate Report');
        this.modalRef.close();
      },() =>{
        alert('Report Successfully Generated');
        this.modalRef.close();
        this.getStudents();
      }
    );

  }

  excelReportToday(result){
      const newArray: any[] = [];
      const data = Object.values(result);
      Object.keys(data).forEach((key, index) => {
          newArray.push({
              ID : data[key].id,
              CLASSNAME : data[key].className,
              STUDENTNAME : data[key].studentName,
              GRADE : data[key].grade,
              CREATED_DATE : data[key].createdDate,
              ISPRESENT : data[key].isPresent

  });
});
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'StudentListReportDaily.xlsx');
}

excelReportTerm(result){
  const newArray: any[] = [];
  const data = Object.values(result);
  Object.keys(data).forEach((key, index) => {
      newArray.push({
          ID : data[key].id,
          CLASSNAME : data[key].className,
          STUDENTNAME : data[key].studentName,
          GRADE : data[key].grade,
          CREATED_DATE : data[key].createdDate,
          ISPRESENT : data[key].isPresent

});
});
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'StudentListReportTerm.xlsx');
}


  editStudent(){

  }

  deleteStudent(){

  }
  
}

