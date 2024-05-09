import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup} from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { StudentModel } from './student.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  formValue!: FormGroup;

  studentobj: StudentModel = new StudentModel;

  allstudent: any;

  searchtext:any;

  btnUpdateShow:boolean = false;

  btnSaveShow:boolean = true;



  constructor(private formBuilder:FormBuilder, private api:ApiService ) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name:[''],
      Avatar:[''],
      email:[''],
      dob:['']
      // age:['']
    })
    this.AllStudent();
  }

  AddStudent(){
    this.studentobj.name = this.formValue.value.name;
    this.studentobj.email = this.formValue.value.email;
    this.studentobj.dob=this.formValue.value.dob;
    // this.studentobj.age = this.formValue.value.age;
    this.studentobj.Avatar = this.formValue.value.Avatar;

    this.api.postStudent(this.studentobj).subscribe({
      next: (v) => {console.log(v)},
    error: (e) => {
      alert("Error")
      console.log(e)},
    complete: () => {
      console.log('complete')
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User Added !! , User Successfully ",
        showConfirmButton: false,
        timer: 1500
      });

      // alert("Data Saved")
      this.AllStudent();
      this.formValue.reset();
    } })

  }

  AllStudent(){
    this.api.getStudent().subscribe(res => {
      this.allstudent = res;
    })
  }

  EditStudent(data:any){
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['Avatar'].setValue(data.Avatar);
    // this.formValue.controls['age'].setValue(data.age);
    this.formValue.controls['dob'].setValue(data.dob);
    this.studentobj.id = data.id;
    this.UpdateShowBtn();
  }

  UpdateStudent(){
    this.studentobj.name = this.formValue.value.name;
    this.studentobj.email = this.formValue.value.email;
    // this.studentobj.age = this.formValue.value.age;
    this.studentobj.dob = this.formValue.value.dob;
    this.studentobj.Avatar = this.formValue.value.Avatar;

    this.api.putStudent(this.studentobj,this.studentobj.id).subscribe(res => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User updated !! , User Successfully ",
        showConfirmButton: false,
        timer: 1500
      });
      // alert("Data Updated");
      this.AllStudent();
      this.SaveShowBtn();
    })


  }


  DeleteStudent(data:any){
    // this.api.deleteStudent(data.id).subscribe(res => {
    //   alert("Record Deleted");
    //   this.AllStudent();
    // })
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover deleted record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteStudent(data.id).subscribe(res => {
          this.AllStudent();
        })

        Swal.fire({
          title: "Deleted!",
          text: "Your record has been deleted.",
          icon: "success"
        });
      }
    });

  }

  UpdateShowBtn()
  {
    this.btnUpdateShow = true;
    this.btnSaveShow = false;
  }
  SaveShowBtn()
  {
    this.btnUpdateShow = false;
    this.btnSaveShow = true;
  }



}
