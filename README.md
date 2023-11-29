# Tailwind-CSS-simple-social-media-platform

โปรเจคนี้เป็นโปรเจคที่ตั้งใจทำขึ้นเพื่อเน้นการใช้งาน Tailwind CSS ในการพัฒนา โดยใช้รูปแบบจากแอป Instagram เป็นแบบอย่างครับ

ใช้ Vite.js + React + Tailwind CSS ในส่วนหน้าบ้าน </br>
ใช้ Node.js + Express.js ในการสร้าง API </br>
ใช้ฐานข้อมูล MySql </br>
ใช้ Cloudinary ในการเก็บไฟล์ภาพ </br>

วิดีโอตัวอย่าง https://www.youtube.com/watch?v=Wa3drbFGWgU </br>

# การติดตั้ง
### ส่วน API 
-ทำการติดตั้งแพคเกจ โดย cd ไปที่โฟลเดอร์ Simple-image-post-api และใช้คำสั่ง npm install </br>
-เปิดไฟล์ .env ในเพื่อทำการใส่ค่า </br>
  &nbsp;&nbsp;&nbsp;-Port </br> 
  &nbsp;&nbsp;&nbsp;-Password และ ชื่อฐานข้อมูล สำหรับ MySql </br>
  &nbsp;&nbsp;&nbsp;-ค่าต่างๆสำหรับเชื่อมต่อกับ Cloudinary API </br>
-ทำการสร้าง schema MySql โดยชื่อจะต้องตรงกับชื่อที่ตั้งไว้ใน .env (DB_NAME) </br>
-เริ่มการทำงาน sever โดยคำสั่ง npx nodemon </br>

### ส่วน WEB 
-ทำการติดตั้งแพคเกจ โดย cd ไปที่โฟลเดอร์ Simple-image-post-web และใช้คำสั่ง npm install </br>
-เปิดไฟล์ env.js ในโฟลเดอร์ src ทำการใส่ค่า URL ของฝั่ง web และ ของฝั่ง api </br>
-เริ่มการทำงานโดยคำสั่ง npm run dev </br>
