export const verifyEmailTemplate = `<mjml>
  <mj-head>
    <mj-title>Verify Your Email Address</mj-title>
    <mj-font
      name="Roboto"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
    />
    <mj-attributes>
      <mj-all font-family="Roboto, Arial, sans-serif" />
      <mj-button border-radius="6px" />
    </mj-attributes>
    <mj-style>
      .token-container {
        background: #ffffff;
        border: 2px dashed tomato;
        border-radius: 10px;
        font-family: monospace;
        letter-spacing: 10px;
        padding: 25px 30px;
        text-align: center;
        color: #111827;
        font-size: 36px;
        font-weight: 700;
        display: inline-block;
      }
      .verification-button {
        border-radius: 8px;
        transition: all 0.3s ease;
      }
      .footer-text {
        color: #98a2b3;
      }
      .brand-text {
        color: tomato;
        font-weight: 600;
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#f5f7fa">

    <!-- Header -->
    <mj-section background-color="tomato" padding="30px 0">
      <mj-column>
        <mj-text css-class="header-title" align="center" font-size="40px" font-weight="700" color="#ffffff" letter-spacing="1px">
          SHARP MART
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Main Content -->
    <mj-section background-color="#ffffff" padding="40px 20px" border-radius="8px">
      <mj-column>
        <mj-text font-size="24px" font-weight="600" color="#1f2937" align="center" padding-bottom="20px">
          Verify Your Email Address
        </mj-text>

        <mj-text font-size="16px" color="#4b5563" line-height="24px" align="center" padding-bottom="16px">
          Thanks for signing up with <span class="brand-text">SHARP MART</span>! Please verify your email address to complete your registration.
        </mj-text>

        <mj-text font-size="18px" color="#4b5563" line-height="24px" align="center" padding-bottom="8px">
          Your 8-digit verification code:
        </mj-text>

        <mj-text align="center" padding="0">
          <span class="token-container">{{CODE}}</span>
        </mj-text>

        <mj-spacer height="24px" />

        <mj-text font-size="16px" color="#4b5563" line-height="24px" align="center" padding-bottom="24px">
          Or click the button below to verify instantly:
        </mj-text>

        <mj-button
          css-class="verification-button"
          background-color="tomato"
          color="white"
          font-size="18px"
          font-weight="500"
          inner-padding="15px 30px"
          href="{{LINK}}"
        >
          Verify My Email
        </mj-button>

        <mj-spacer height="24px" />

        <mj-text font-size="14px" color="#6b7280" line-height="22px" align="center">
          If you didn't create an account with SHARP MART, you can safely ignore this email.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section padding-top="30px" padding-bottom="20px">
      <mj-column>
        <mj-divider border-width="1px" border-color="#e5e7eb" padding="10px 0" />
        <mj-text css-class="footer-text" font-size="14px" align="center" padding-top="10px">
          © 2025 SHARP MART — Surat, Gujarat
        </mj-text>
        <mj-text css-class="footer-text" font-size="14px" align="center" padding-top="8px">
          <a href="https://sharp-mart.vercel.app" style="color:tomato;text-decoration:none;">Help Center</a> &nbsp;|&nbsp;
          <a href="https://sharp-mart.vercel.app" style="color:tomato;text-decoration:none;">Terms</a> &nbsp;|&nbsp;
          <a href="https://sharp-mart.vercel.app" style="color:tomato;text-decoration:none;">Privacy</a>
        </mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>`;

export const resetPasswordEmailTemplate = `<mjml>
  <mj-head>
    <mj-title>Reset Your Password</mj-title>
    <mj-font
      name="Roboto"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
    />
    <mj-attributes>
      <mj-all font-family="Roboto, Arial, sans-serif" />
      <mj-button border-radius="6px" />
    </mj-attributes>
    <mj-style>
      .reset-button {
        border-radius: 8px;
        transition: all 0.3s ease;
      }
      .footer-text {
        color: #98a2b3;
      }
      .brand-text {
        color: tomato;
        font-weight: 600;
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#f5f7fa">

    <!-- Header -->
    <mj-section background-color="tomato" padding="30px 0">
      <mj-column>
        <mj-text css-class="header-title" align="center" font-size="40px" font-weight="700" color="#ffffff" letter-spacing="1px">
          SHARP MART
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Main Content -->
    <mj-section background-color="#ffffff" padding="40px 20px" border-radius="8px">
      <mj-column>
        <mj-text font-size="24px" font-weight="600" color="#1f2937" align="center" padding-bottom="20px">
          Reset Your Password
        </mj-text>

        <mj-text font-size="16px" color="#4b5563" line-height="24px" align="center" padding-bottom="16px">
          Hi <span class="brand-text">{{NAME}}</span>,
        </mj-text>

        <mj-text font-size="16px" color="#4b5563" line-height="24px" align="center" padding-bottom="16px">
          We received a request to reset the password for your <span class="brand-text">SHARP MART</span> account. No changes have been made yet.
        </mj-text>

        <mj-text font-size="16px" color="#4b5563" line-height="24px" align="center" padding-bottom="24px">
          To reset your password, click the button below:
        </mj-text>

        <mj-button
          css-class="reset-button"
          background-color="tomato"
          color="white"
          font-size="18px"
          font-weight="500"
          inner-padding="15px 30px"
          href="{{LINK}}"
          target="_blank"
        >
          Reset Password
        </mj-button>

        <mj-spacer height="24px" />

        <mj-text font-size="14px" color="#6b7280" line-height="22px" align="center" padding-bottom="8px">
          If the button above doesn't work, copy and paste this link into your browser:
        </mj-text>

        <mj-text font-size="14px" color="tomato" line-height="20px" align="center" padding-bottom="24px">
          <a href="{{LINK}}" style="color: tomato; text-decoration: none;">{{LINK}}</a>
        </mj-text>

        <mj-text font-size="14px" color="#6b7280" line-height="22px" align="center">
          If you didn’t request a password reset for your <span class="brand-text">SHARP MART</span> account, you can safely ignore this email.
        </mj-text>

        <mj-text font-size="14px" color="#6b7280" line-height="22px" align="center" padding-top="10px">
          This reset link will expire in 24 hours.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section padding-top="30px" padding-bottom="20px">
      <mj-column>
        <mj-divider border-width="1px" border-color="#e5e7eb" padding="10px 0" />
        <mj-text css-class="footer-text" font-size="14px" align="center" padding-top="10px">
          © 2025 SHARP MART — Surat, Gujarat
        </mj-text>
        <mj-text css-class="footer-text" font-size="14px" align="center" padding-top="8px">
          <a href="https://sharp-mart.vercel.app" style="color:tomato;text-decoration:none;">Help Center</a> &nbsp;|&nbsp;
          <a href="https://sharp-mart.vercel.app" style="color:tomato;text-decoration:none;">Terms</a> &nbsp;|&nbsp;
          <a href="https://sharp-mart.vercel.app" style="color:tomato;text-decoration:none;">Privacy</a>
        </mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>`;
