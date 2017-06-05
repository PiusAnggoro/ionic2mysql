import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-add-technology',
  templateUrl: 'add-technology.html'
})
export class AddTechnology {
   // properti model
   public form                   : FormGroup;
   public technologyName         : any;
   public technologyDescription  : any;

   // penanda apakah isian baru/editing
   public isEdited               : boolean = false;
   public hideForm               : boolean = false;

   public pageTitle              : string;
   public recordID               : any      = null;
   private baseURI               : string  = "http://localhost/~piusanggoro/ion/";

   // inisialisasi
   constructor(public navCtrl    : NavController,
               public http       : Http,
               public NP         : NavParams,
               public fb         : FormBuilder,
               public toastCtrl  : ToastController){  
      this.form = fb.group({
         "name"                  : ["", Validators.required],
         "description"           : ["", Validators.required]
      });
   }

   ionViewWillEnter(){
      this.resetFields();
      if(this.NP.get("record")){
         this.isEdited      = true;
         this.selectEntry(this.NP.get("record"));
         this.pageTitle     = 'Daftar TUGAS';
      }else{
         this.isEdited      = false;
         this.pageTitle     = 'Tambah TUGAS';
      }
   }

   selectEntry(item){
      this.technologyName        = item.name;
      this.technologyDescription = item.description;
      this.recordID              = item.id;
   }

  // jika data baru
   createEntry(name, description){
      let body     : string   = "key=create&name=" + name + "&description=" + description,
          type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
          headers  : any      = new Headers({'Content-Type': type}),
          options  : any      = new RequestOptions({ headers: headers }),
          url      : any      = this.baseURI + "manage-data.php";

      //request http ke server
      this.http.post(url, body, options)
      .subscribe((data) =>{
         //jika berhasil
         if(data.status === 200){
            this.hideForm   = true;
            this.sendNotification(`Tugas ${name} telah ditambahkan`);
         }else{
            this.sendNotification('Terjadi kesalahan!');
         }
      });
   }

   updateEntry(name, description){
      let body       : string = "key=update&name=" + name + "&description=" + description + "&recordID=" + this.recordID,
          type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers    : any    = new Headers({ 'Content-Type': type}),
          options    : any    = new RequestOptions({ headers: headers }),
          url        : any    = this.baseURI + "manage-data.php";
      this.http.post(url, body, options)
      .subscribe(data =>{
         if(data.status === 200){
            this.hideForm  =  true;
            this.sendNotification(`Tugas ${name} telah berhasil diperbaharui`);
         }else{
            this.sendNotification('Terjadi kesalahan!');
         }
      });
   }

   deleteEntry(){
      let name       : string = this.form.controls["name"].value,
          body       : string = "key=delete&recordID=" + this.recordID,
          type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers    : any    = new Headers({ 'Content-Type': type}),
          options    : any    = new RequestOptions({ headers: headers }),
          url        : any    = this.baseURI + "manage-data.php";
      this.http.post(url, body, options)
      .subscribe(data =>{
         if(data.status === 200){
            this.hideForm     = true;
            this.sendNotification(`Tugas ${name} telah dihapus`);
         }else{
            this.sendNotification('Terjadi kesalahan!');
         }
      });
   }

    //fungsi ini dijalankan saat tombol simpan disentuh
   saveEntry(){
      //proses mengambil data/value dari form
      let name          : string = this.form.controls["name"].value,
          description   : string = this.form.controls["description"].value;
      if(this.isEdited){
        // jika mengedit data
         this.updateEntry(name, description);
      } else{
         // jika data baru
         this.createEntry(name, description);
      }
   }

   resetFields() : void{
      this.technologyName           = "";
      this.technologyDescription    = "";
   }

   sendNotification(message)  : void{
      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000
      });
      notification.present();
   }
}