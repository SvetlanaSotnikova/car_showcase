import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, cars } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const carsHtml = cars
      .map(
        (car: any) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${car.make}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${car.model}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${car.year}</td>
        </tr>
      `,
      )
      .join("");
    await transporter.sendMail({
      from: `"Car Rent Site" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Car Order Request",
      html: `
        <div style="font-family:Arial, sans-serif; background:#f6f6f6; padding:30px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:25px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="margin-top:0;color:#2563eb;">New Car Rental Request</h2>
            
            <p style="color:#555;">A user submitted a request from the website.</p>

            <h3 style="margin-top:25px;">Customer Information</h3>
            <table style="width:100%;border-collapse:collapse;">
            <tr>
                <td style="padding:8px;font-weight:bold;">Name</td>
                <td style="padding:8px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px;font-weight:bold;">Email</td>
                <td style="padding:8px;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px;font-weight:bold;">Phone</td>
                <td style="padding:8px;">${phone}</td>
              </tr>
            </table>

            <h3 style="margin-top:25px;">Selected Cars</h3>
            <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th style="padding:10px;text-align:left;">Make</th>
                  <th style="padding:10px;text-align:left;">Model</th>
                  <th style="padding:10px;text-align:left;">Year</th>
                </tr>
              </thead>
              <tbody>
                ${carsHtml}
              </tbody>
            </table>

            <p style="margin-top:25px;color:#888;font-size:13px;">
              This message was automatically generated from the Car Rent website.
            </p>

          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}
