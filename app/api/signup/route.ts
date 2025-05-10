import { sendVerificationEmail } from "@/helpers/email/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    // check if user exist with username
    const existingUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken!",
        },
        { status: 400 }
      );
    }

    // check if user exist with email
    const existingUserByEmail = await User.findOne({email});
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const hashedPassword = await bcrypt.hash(password, 10);

    if(existingUserByEmail) {
      // check if email is verified
      if(existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exists with this email"
        }, {status: 400})
      } else {
        // by now, username is fresh, email is registered but not verified, so we will update the user
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }

      // check if email is not verified
    } else {
      const newUser = new User({
        username, 
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
      });
      await newUser.save();
    }

    // if all went ok, and reached till here, that means now we have either updated the user, or created a new user, in both the cases, we need to send verification email
    const verificationEmailResponse = await sendVerificationEmail(username, email, verifyCode);
    if(!verificationEmailResponse.success) {
      return Response.json({success: false, message: verificationEmailResponse.message}, {status: 500})
    }

    return Response.json({success: true, message: "User registered successfully. Please verify your account."}, { status: 201})
  } catch (error) {
    console.log("Error while registering user ::", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
