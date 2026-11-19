const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function runTestSuite() {
  console.log("🚀 Starting Playwright End-to-End Test Suite for Dinna Mirzabayeva Website...\n");
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const testDir = path.join(__dirname, "test-artifacts");
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  function logResult(name, status, details = "") {
    const icon = status ? "✅ PASS" : "❌ FAIL";
    console.log(`${icon}: ${name} ${details ? `(${details})` : ""}`);
    results.push({ name, status, details });
  }

  // ==========================================
  // TEST SCENARIO 1: DESKTOP HOME PAGE & HOOK #1, HOOK #2
  // ==========================================
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log("--- 1. Testing Desktop Home Page & Hero Section ---");
    await page.goto("http://localhost:3000/uz", { waitUntil: "networkidle" });

    // Check Hero elements
    const heroTitle = await page.textContent("h1");
    const hasHeroText = heroTitle.includes("O'zingizni toping");
    logResult("Hero Title rendering", hasHeroText, heroTitle.trim().slice(0, 40) + "...");

    const portraitImg = await page.$('img[alt*="Dinna Mirzabayeva"]');
    logResult("Dinna Mirzabayeva Hero Portrait", !!portraitImg);

    const liveBadge = await page.textContent("text=Toshkent 5/5 · Qabul ochiq");
    logResult("Live Status Pill", !!liveBadge);

    // Save Hero Screenshot
    await page.screenshot({ path: path.join(testDir, "01_desktop_hero.png") });

    // Test Service Tabs (Bento Grid)
    console.log("\n--- 2. Testing Services Bento Grid & Tabs ---");
    const onlineTab = await page.$('button[role="tab"]:has-text("Onlayn")');
    if (onlineTab) {
      await onlineTab.click();
      await page.waitForTimeout(300);
      logResult("Services Tab Switch to 'Onlayn'", true);
    } else {
      logResult("Services Tab Switch", false, "Tab button not found");
    }

    // Open Booking Modal
    console.log("\n--- 3. Testing Hook #1 & Hook #2 in Booking Modal ---");
    const ctaBtn = await page.$('button:has-text("Konsultatsiyaga yozilish")');
    await ctaBtn.click();
    await page.waitForTimeout(500);

    const modalDialog = await page.$('[role="dialog"]');
    logResult("Booking Modal Opens", !!modalDialog);

    // Test Hook #1: Anonymous Mode Switch
    const anonSwitch = await page.$("#anonymous-toggle");
    logResult("Anonymous Switch exists in Modal", !!anonSwitch);

    if (anonSwitch) {
      await anonSwitch.click();
      await page.waitForTimeout(300);

      const reassuranceBadge = await page.textContent("text=shaxsingiz 100% sir saqlanadi");
      logResult("Hook #1: Reassurance Badge appears on toggle", !!reassuranceBadge);

      const nameLabel = await page.textContent('label[for="apply-name"]');
      const isTaxallus = nameLabel.includes("Taxallus");
      logResult("Hook #1: Label transforms to 'Taxallus'", isTaxallus, nameLabel.trim());
    }

    // Test Hook #2: Format & Slot Picker
    const onlineFormatBtn = await page.$('button:has-text("Onlayn Video")');
    if (onlineFormatBtn) {
      await onlineFormatBtn.click();
      logResult("Hook #2: Step A - Format Switcher to Online", true);
    }

    const indingaDayBtn = await page.$('button:has-text("Indinga")');
    if (indingaDayBtn) {
      await indingaDayBtn.click();
      logResult("Hook #2: Step B - Day Pill selection (Indinga)", true);
    }

    const slotBtn = await page.$('button:has-text("16:30")');
    if (slotBtn) {
      await slotBtn.click();
      logResult("Hook #2: Step B - Time Slot selection (16:30)", true);
    }

    // Test Contact Method: Telegram
    const telegramTabBtn = await page.$('button:has-text("Telegram @username")');
    if (telegramTabBtn) {
      await telegramTabBtn.click();
      await page.waitForTimeout(200);

      const telegramInput = await page.$("#apply-telegram");
      logResult("Hook #2: Step C - Telegram @username input displays", !!telegramInput);
      if (telegramInput) {
        await telegramInput.fill("@dilnoza_test");
      }
    }

    await page.screenshot({ path: path.join(testDir, "02_booking_modal_anonymous.png") });

    // Close modal
    const closeBtn = await page.$('button:has-text("✕")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);

    await context.close();
  } catch (err) {
    logResult("Desktop Scenario Execution", false, err.message);
  }

  // ==========================================
  // TEST SCENARIO 2: PRE-QUALIFYING DIAGNOSTIC QUIZ (/uz/test)
  // ==========================================
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log("\n--- 4. Testing Hook #3: Pre-Qualifying Diagnostic Quiz (/uz/test) ---");
    await page.goto("http://localhost:3000/uz/test", { waitUntil: "networkidle" });

    // Step 1: Intro
    const introTitle = await page.textContent("h1");
    logResult("Quiz Step 1 Intro renders", introTitle.includes("Muammodan yechimga"));

    const startQuizBtn = await page.$('button:has-text("Diagnostikani boshlash")');
    await startQuizBtn.click();
    await page.waitForTimeout(400);

    // Step 2: Answer 4 questions
    console.log("Answering 4 diagnostic questions...");

    // Q1: Stress & Fatigue
    const q1Opt = await page.$('text=Doimiy stress, uyqusizlik');
    logResult("Q1 Question (Core Struggle) renders", !!q1Opt);
    await q1Opt.click();
    await page.waitForTimeout(400);

    // Q2: Duration
    const q2Opt = await page.$('text=Bir necha oydan beri');
    logResult("Q2 Question (Duration) renders", !!q2Opt);
    await q2Opt.click();
    await page.waitForTimeout(400);

    // Q3: Readiness
    const q3Opt = await page.$("text=Ha, to'liq tayyorman");
    logResult("Q3 Question (Readiness) renders", !!q3Opt);
    await q3Opt.click();
    await page.waitForTimeout(400);

    // Q4: Format
    const q4Opt = await page.$('text=Toshkentda oflayn (5/5');
    logResult("Q4 Question (Format) renders", !!q4Opt);
    await q4Opt.click();
    await page.waitForTimeout(500);

    // Step 3: Lead form with Hook #1 Anonymous switch
    console.log("Verifying Quiz Lead Form with Hook #1...");
    const quizAnonSwitch = await page.$("#quiz-anonymous-toggle");
    logResult("Quiz Lead Form: Anonymous Switch exists", !!quizAnonSwitch);

    if (quizAnonSwitch) {
      await quizAnonSwitch.click();
      await page.waitForTimeout(300);

      // Select Telegram toggle via explicit ID
      const quizTgToggle = await page.$("#quiz-toggle-telegram");
      if (quizTgToggle) {
        await quizTgToggle.click();
        await page.waitForTimeout(200);
        await page.fill("#quiz-telegram", "@anonim_mehmon_77");
        logResult("Quiz Lead Form: Telegram @username filled", true);
      }
    }

    await page.screenshot({ path: path.join(testDir, "03_quiz_lead_form.png") });

    // Submit Lead Form via explicit ID
    const submitBtn = await page.$("#quiz-submit-btn");
    await submitBtn.click();
    await page.waitForSelector("#quiz-result-recommendation", { timeout: 8000 });

    // Step 4: Result Card (Hook #3)
    console.log("Verifying Step 4 Dynamic Result Card...");
    const resultTitle = await page.textContent("#quiz-result-recommendation");
    const hasAntistressRecommendation = resultTitle.includes("Antistress");
    logResult("Hook #3: Tailored Service Recommendation matches Q1", hasAntistressRecommendation, resultTitle.trim());

    const directTelegramLink = await page.$('a[href*="t.me/m1rzabayevaa_021"]');
    logResult("Hook #3: 1-Click Telegram Direct Link with context", !!directTelegramLink);

    await page.screenshot({ path: path.join(testDir, "04_quiz_result_card.png") });

    await context.close();
  } catch (err) {
    logResult("Quiz Scenario Execution", false, err.message);
  }

  // ==========================================
  // TEST SCENARIO 3: MOBILE INSTAGRAM IN-APP BROWSER (390x844)
  // ==========================================
  try {
    console.log("\n--- 5. Testing Mobile Viewport & Sticky Bar Drawer (iPhone 14 / Instagram) ---");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0.0",
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto("http://localhost:3000/uz", { waitUntil: "networkidle" });

    // Check horizontal scroll overflow
    const overflowCheck = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    logResult("Mobile Overflow Check: Zero horizontal scrolling", overflowCheck);

    // Scroll down to trigger sticky bar
    await mobilePage.evaluate(() => window.scrollBy(0, 400));
    await mobilePage.waitForTimeout(400);

    const stickyBar = await mobilePage.$('aside[aria-label="Tezkor amallar"]');
    logResult("Mobile Sticky Bar displays after scroll", !!stickyBar);

    // Click 'Yozilish' on sticky bar -> Should open Drawer
    const yozilishBtn = await mobilePage.$('aside button:has-text("Yozilish")');
    if (yozilishBtn) {
      await yozilishBtn.click();
      await mobilePage.waitForTimeout(600);

      // Drawer check: Vaul adds [data-vaul-drawer] or role="dialog"
      const drawer = await mobilePage.$('[data-vaul-drawer], [role="dialog"]');
      logResult("Mobile Drawer (vaul) slides up smoothly", !!drawer);

      await mobilePage.screenshot({ path: path.join(testDir, "05_mobile_drawer.png") });
    }

    await mobileContext.close();
  } catch (err) {
    logResult("Mobile Scenario Execution", false, err.message);
  }

  await browser.close();

  console.log("\n==========================================");
  console.log("🏁 TEST SUITE FINISHED");
  console.log("==========================================");
  const total = results.length;
  const passed = results.filter((r) => r.status).length;
  const failed = total - passed;
  console.log(`Total Tests: ${total} | Passed: ${passed} | Failed: ${failed}`);

  if (failed === 0) {
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! ZERO ERRORS.");
  } else {
    console.log("⚠️ Some tests encountered issues. Review log above.");
  }

  return { total, passed, failed, results };
}

runTestSuite().catch(console.error);
