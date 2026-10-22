import os
import sys

output_dir = r'c:\Users\amanr\Abcd\screenshots'
os.makedirs(output_dir, exist_ok=True)

from playwright.sync_api import sync_playwright

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    
    # 1. Desktop Viewport (1440x900)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    console_errors = []
    page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
    
    page.goto('http://localhost:8080/index.html', wait_until='networkidle')
    page.screenshot(path=os.path.join(output_dir, 'desktop_hero.png'), full_page=False)
    page.screenshot(path=os.path.join(output_dir, 'desktop_full.png'), full_page=True)
    print('Captured desktop screenshots!')

    # 2. Tablet Viewport (820x1180)
    page.set_viewport_size({'width': 820, 'height': 1180})
    page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(output_dir, 'tablet_hero.png'), full_page=False)
    page.screenshot(path=os.path.join(output_dir, 'tablet_full.png'), full_page=True)
    print('Captured tablet screenshots!')

    # 3. Mobile Viewport (390x844 - iPhone)
    page.set_viewport_size({'width': 390, 'height': 844})
    page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(output_dir, 'mobile_hero.png'), full_page=False)
    page.screenshot(path=os.path.join(output_dir, 'mobile_full.png'), full_page=True)
    print('Captured mobile screenshots!')

    # 4. Test Mobile Menu Toggle
    menu_toggle = page.query_selector('#menuToggle')
    if menu_toggle:
        menu_toggle.click()
        page.wait_for_timeout(300)
        page.screenshot(path=os.path.join(output_dir, 'mobile_menu_open.png'), full_page=False)
        print('Captured mobile menu open screenshot!')
        menu_toggle.click()
        page.wait_for_timeout(300)

    # 5. Test Card Interaction on Desktop
    page.set_viewport_size({'width': 1440, 'height': 900})
    page.wait_for_timeout(400)
    
    # Click next dot on phone card
    dots = page.query_selector_all('.phone-dot')
    if len(dots) > 1:
        dots[1].click()
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(output_dir, 'phone_card_switched.png'))
        print('Captured phone card switched screenshot!')

    # Click "Read 60-word Short"
    try:
        # Check if modal is already open
        open_dlg = page.query_selector('dialog[open]')
        if open_dlg:
            page.evaluate('document.querySelectorAll("dialog[open]").forEach(d => d.close())')
            page.wait_for_timeout(200)

        short_btn = page.query_selector('[data-read-short]')
        if short_btn:
            short_btn.click(timeout=3000)
            page.wait_for_timeout(400)
            page.screenshot(path=os.path.join(output_dir, 'reader_modal_open.png'))
            print('Captured reader modal screenshot!')
            close_btn = page.query_selector('#cardDetailDlg [data-close]')
            if close_btn:
                close_btn.click()
                page.wait_for_timeout(300)
    except Exception as e:
        print('Modal test warning (non-fatal):', e)

    browser.close()

    if console_errors:
        print('Console errors encountered:', len(console_errors), console_errors)
    else:
        print('SUCCESS: ZERO console errors encountered!')
