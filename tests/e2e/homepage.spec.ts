import { expect, test, type Page } from "@playwright/test";

 const viewports = [
   { name: "mobile", width: 390, height: 844, minScore: 92 },
   { name: "tablet", width: 768, height: 1024, minScore: 94 },
   { name: "desktop", width: 1440, height: 900, minScore: 96 },
 ];

 type UxAuditResult = {
   hardGateFailures: string[];
   issues: string[];
   score: number;
 };

 async function runUxAudit(page: Page): Promise<UxAuditResult> {
   return page.evaluate(() => {
     const hardGateFailures: string[] = [];
     const issues: string[] = [];
     let score = 100;

     const doc = document.documentElement;
     const horizontalOverflow = doc.scrollWidth - doc.clientWidth;
     if (horizontalOverflow > 1) {
       hardGateFailures.push(`horizontal overflow ${horizontalOverflow}px`);
       score -= 35;
     }

     const scrollBurden = doc.scrollHeight / window.innerHeight;
     const maxScrollBurden = window.innerWidth < 600 ? 12 : window.innerWidth < 1_000 ? 9 : 8;
     if (scrollBurden > maxScrollBurden) {
       issues.push(`scroll burden ${scrollBurden.toFixed(1)} screens`);
       score -= Math.min(15, Math.ceil((scrollBurden - maxScrollBurden) * 3));
     }

     const nav = document.querySelector("nav")?.getBoundingClientRect();
     const sectionTargets = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
     for (const section of sectionTargets) {
       const scrollMarginTop = Number.parseFloat(getComputedStyle(section).scrollMarginTop || "0");
       if (nav && scrollMarginTop + 1 < nav.height) {
         issues.push(`${section.id} scroll margin ${scrollMarginTop}px is smaller than nav ${nav.height}px`);
         score -= 4;
       }
     }

     const linkTargets = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='#']"))
       .map((link) => link.getAttribute("href")?.slice(1))
       .filter((id): id is string => Boolean(id));
     for (const id of linkTargets) {
       if (!document.getElementById(id)) {
         hardGateFailures.push(`missing anchor target ${id}`);
         score -= 20;
       }
     }

     const tappableElements = Array.from(document.querySelectorAll<HTMLElement>("a, button")).filter((element) => {
       const rect = element.getBoundingClientRect();
       const style = getComputedStyle(element);
       return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
     });
     for (const element of tappableElements) {
       const rect = element.getBoundingClientRect();
       const minSize = window.innerWidth < 600 ? 40 : 28;
       if (rect.width < minSize || rect.height < minSize) {
         issues.push(`small tap target "${element.textContent?.trim()}" ${Math.round(rect.width)}x${Math.round(rect.height)}`);
         score -= 3;
       }
     }

     const blocks = Array.from(
       document.querySelectorAll<HTMLElement>(
         ".hero-title, .hero-description, .cta-buttons, .stat-item, .section-title, .section-subtitle, .experience-item, .education-item, .project-card, .oss-item, .skill-category, .contact-item, footer",
       ),
     ).filter((element) => {
       const rect = element.getBoundingClientRect();
       const style = getComputedStyle(element);
       return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
     });

     for (let i = 0; i < blocks.length; i += 1) {
       for (let j = i + 1; j < blocks.length; j += 1) {
         const a = blocks[i].getBoundingClientRect();
         const b = blocks[j].getBoundingClientRect();
         const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
         const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
         const overlapArea = overlapWidth * overlapHeight;
         if (overlapArea > 16) {
           hardGateFailures.push(
             `overlap "${blocks[i].className}" with "${blocks[j].className}" ${Math.round(overlapWidth)}x${Math.round(overlapHeight)}`,
           );
           score -= 25;
         }
       }
     }

     const firstViewportSignals = [".hero-title", ".hero-description", ".cta-buttons"];
     for (const selector of firstViewportSignals) {
       const rect = document.querySelector(selector)?.getBoundingClientRect();
       if (!rect || rect.top >= window.innerHeight || rect.bottom <= 0) {
         hardGateFailures.push(`${selector} is not visible in first viewport`);
         score -= 20;
       }
     }

     return {
       hardGateFailures,
       issues,
       score: Math.max(0, score),
     };
   });
 }

 test("renders the portfolio content and primary calls to action", async ({ page }) => {
   await page.goto("/");

   const hero = page.locator("#home");

   await expect(page).toHaveTitle(/Eunhwa \| Backend \/ Platform Engineer/);
   await expect(page.getByRole("heading", { name: /Backend & Platform Engineer\s+Eunhwa Park/ })).toBeVisible();
   await expect(page.getByText(/Seeking U\.S\. backend and platform software engineering roles/i)).toBeVisible();
   const resumeLink = hero.getByRole("link", { name: "View Resume" });
   await expect(resumeLink).toHaveAttribute("href", "Resume.pdf");
   await expect(resumeLink).toHaveAttribute("target", "_blank");
   await expect(resumeLink).not.toHaveAttribute("download", /.*/);
   await expect(hero.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
     "href",
     "https://www.linkedin.com/in/eunhwa-park-20a286248/",
   );
   await expect(hero.getByRole("link", { name: /View\s+GitHub/ })).toHaveAttribute("href", "https://github.com/eunhwa99");

   for (const heading of ["Experience", "Education", "Selected Projects", "Open Source Contributions", "Skills & Focus", "Availability"]) {
     await expect(page.getByRole("heading", { name: heading })).toBeVisible();
   }
 });

 test("serves the resume PDF for in-browser viewing", async ({ page }) => {
   const response = await page.request.get("/Resume.pdf");

   expect(response.ok()).toBe(true);
   expect(response.headers()["content-type"]).toContain("application/pdf");
 });

 test("calculates years experience from the configured start year", async ({ page }) => {
   await page.addInitScript(() => {
     (window as typeof window & { __PORTFOLIO_CURRENT_YEAR__?: number }).__PORTFOLIO_CURRENT_YEAR__ = 2026;
   });
   await page.goto("/");

   const experienceStat = page.locator(".stat-item").filter({ hasText: "Years Experience" });
   const statNumber = experienceStat.locator(".stat-number");

   await expect(statNumber).toHaveAttribute("data-years-experience-start", "2023");
   await expect(statNumber).toHaveText("3+");
 });

 test("uses recruiter-facing hero stats instead of leading with GPA", async ({ page }) => {
   await page.goto("/");

   const hero = page.locator("#home");
   const uiucStat = hero.locator(".stat-item").filter({ hasText: "UIUC MCS" });
   const awsStat = hero.locator(".stat-item").filter({ hasText: "AWS" });

   await expect(uiucStat.getByText("UIUC MCS", { exact: true })).toBeVisible();
   await expect(uiucStat.getByText("Incoming 2026", { exact: true })).toBeVisible();
   await expect(awsStat.getByText("AWS", { exact: true })).toBeVisible();
   await expect(awsStat.getByText("Solutions Architect Pro", { exact: true })).toBeVisible();
   await expect(hero.getByText("University GPA")).toHaveCount(0);
 });

 test("prioritizes the strongest recruiter-facing GitHub work", async ({ page }) => {
   await page.goto("/");

   const projectTitles = await page.locator("#projects .project-title").allTextContents();

   expect(projectTitles.slice(0, 5)).toEqual([
     "ContextWiki / MCPContentSearch",
     "Agent Harness Playbook + Codex Config",
     "AI News Alerts",
     "RepoLens",
     "ImageGallery",
   ]);

   const projects = page.locator("#projects");
   await expect(projects.getByText(/citation-ready knowledge backend/i)).toBeVisible();
   await expect(projects.getByText(/executable companion/i)).toBeVisible();
   await expect(projects.getByText(/scheduled Slack brief/i)).toBeVisible();
   await expect(projects.getByText(/onboarding-ready\s+exploration\s+workspace/i)).toBeVisible();
   await expect(projects.getByText("Lanternwood Athenaeum")).toHaveCount(0);
 });

 test("keeps experience focused on backend operations instead of agent harness claims", async ({ page }) => {
   await page.goto("/");

   const experience = page.locator("#experience");
   const experienceBullets = await experience.locator(".job-description li").allTextContents();

   expect(experienceBullets).toHaveLength(4);
   await expect(experience.getByText("Jun 2023 ~ Present", { exact: true })).toBeVisible();
   await expect(experience.getByText(/Training:/i)).toHaveCount(0);
   await expect(experience.getByText(/56M\+\s+user/i)).toBeVisible();
   await expect(experience.getByText(/50TB\+\s+data migration/i)).toBeVisible();
   await expect(experience.getByText(/61%\s+runtime reduction/i)).toBeVisible();
   await expect(experience.getByText(/Python and PySpark/i)).toBeVisible();
   await expect(experience.getByText(/agent-assisted engineering harnesses/i)).toHaveCount(0);
 });

 test("shows the education timeline with the incoming UIUC MCS program", async ({ page }) => {
   await page.goto("/");

   const education = page.locator("#education");
   await expect(education.getByText("University of Illinois Urbana-Champaign")).toBeVisible();
   await expect(education.getByText("Incoming Master of Computer Science (MCS)")).toBeVisible();
   await expect(education.getByText("2026 - 2028")).toBeVisible();
   await expect(education.getByText("Kyungpook National University")).toBeVisible();
   await expect(education.getByText("Mobile Engineering")).toBeVisible();
   await expect(education.getByText("GPA 4.45 / 4.5")).toBeVisible();
 });

 test("uses defensible skill categories without overclaiming frontend tooling", async ({ page }) => {
   await page.goto("/");

   const skills = page.locator("#skills");
   await expect(skills.getByText("Backend & Data Systems")).toBeVisible();
   await expect(skills.getByText("Cloud & Delivery")).toBeVisible();
   await expect(skills.getByText("AI Engineering Tooling")).toBeVisible();

   for (const technology of ["PixiJS", "Vitest", "Playwright"]) {
     await expect(skills.getByText(technology, { exact: true })).toHaveCount(0);
   }
 });

 test("keeps project cards concise and points to evidence", async ({ page }) => {
   await page.goto("/");

   const cards = page.locator("#projects .project-card");
   await expect(cards).toHaveCount(5);

   const descriptions = await cards.locator(".project-description").allTextContents();
   for (const description of descriptions) {
     expect(description.trim().length).toBeLessThanOrEqual(190);
   }

   await expect(cards.locator(".project-evidence")).toHaveCount(5);
   for (let i = 0; i < 5; i += 1) {
     const card = cards.nth(i);
     await expect(card.locator(".project-evidence").getByRole("link")).toHaveCount(2);
     await expect(card.locator(".project-evidence").getByRole("link", { name: "Repository", exact: true })).toBeVisible();
   }

   for (const removedLabel of ["Architecture", "Core Loop", "Local e2e verified", "Sample Output", "Source Strategy"]) {
     await expect(page.locator("#projects").getByText(removedLabel, { exact: true })).toHaveCount(0);
   }
 });

 test("keeps availability section focused on email without repeating social links", async ({ page }) => {
   await page.goto("/");

   const availability = page.locator("#availability");

   await expect(availability.getByRole("link", { name: "Email" })).toHaveAttribute(
     "href",
     "mailto:eun.h.engineer@gmail.com",
   );
   await expect(availability.getByRole("link", { name: /LinkedIn/i })).toHaveCount(0);
   await expect(availability.getByRole("link", { name: /GitHub/i })).toHaveCount(0);
 });

 test("keeps internal navigation targets below the fixed nav", async ({ page }) => {
   await page.setViewportSize({ width: 1440, height: 900 });
   await page.goto("/");

   for (const linkName of ["Experience", "Education", "Projects", "Skills", "Availability"]) {
     await page.locator("nav").getByRole("link", { name: linkName, exact: true }).click();
     const targetId = linkName === "Skills" ? "skills" : linkName.toLowerCase();
     await expect(page.locator(`#${targetId}`)).toBeInViewport();

     const clearance = await page.evaluate((id) => {
       const navBottom = document.querySelector("nav")?.getBoundingClientRect().bottom ?? 0;
       const targetTop = document.getElementById(id)?.getBoundingClientRect().top ?? 0;
       return targetTop - navBottom;
     }, targetId);
     expect(clearance, `${linkName} should not be hidden by the fixed nav`).toBeGreaterThanOrEqual(-1);
   }
 });

 for (const viewport of viewports) {
   test(`scores responsive UX quality on ${viewport.name}`, async ({ page }) => {
     await page.setViewportSize({ width: viewport.width, height: viewport.height });
     await page.goto("/");

     const audit = await runUxAudit(page);

     expect(audit.hardGateFailures, `${viewport.name} hard gate failures`).toEqual([]);
     expect(audit.score, `${viewport.name} UX score issues: ${audit.issues.join("; ")}`).toBeGreaterThanOrEqual(viewport.minScore);
   });
 }

 test("keeps all hero calls to action visible in the mobile first viewport", async ({ page }) => {
   await page.setViewportSize({ width: 375, height: 844 });
   await page.goto("/");

   const ctaRects = await page.locator("#home .btn").evaluateAll((buttons) =>
     buttons.map((button) => {
       const rect = button.getBoundingClientRect();
       return {
         bottom: rect.bottom,
         text: button.textContent?.trim() ?? "",
         top: rect.top,
       };
     }),
   );

   expect(ctaRects).toHaveLength(3);
   for (const rect of ctaRects) {
     expect(rect.top, `${rect.text} should be visible below the fixed nav`).toBeGreaterThanOrEqual(70);
     expect(rect.bottom, `${rect.text} should fit in the first mobile viewport`).toBeLessThanOrEqual(844);
   }
 });

 test("marks external new-tab links as safe", async ({ page }) => {
   await page.goto("/");

   const unsafeLinks = await page.evaluate(() =>
     Array.from(document.querySelectorAll<HTMLAnchorElement>("a[target='_blank']"))
       .filter((link) => {
         const rel = new Set((link.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean));
         return !rel.has("noopener") || !rel.has("noreferrer");
       })
       .map((link) => link.href),
   );

   expect(unsafeLinks).toEqual([]);
 });
