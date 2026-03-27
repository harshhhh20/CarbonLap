document.addEventListener('DOMContentLoaded', () => {
    // Navigation logic
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items
            navItems.forEach(n => n.classList.remove('active'));
            // Hide all screens
            screens.forEach(s => s.classList.remove('active'));
            
            // Add active to clicked item
            item.classList.add('active');
            
            // Show target screen
            const targetId = item.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if(target) target.classList.add('active');
        });
    });

    // Strategy Tire Buttons Logic
    const tireBtns = document.querySelectorAll('.t-card');
    tireBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             tireBtns.forEach(b => {
                 b.classList.remove('active');
                 b.classList.remove('cyan-border-glow');
             });
             btn.classList.add('active');
             btn.classList.add('cyan-border-glow');
        });
    });

    // Driver Tabs Logic (Telemetry Screen)
    const driverTabs = document.querySelectorAll('.d-tab');
    driverTabs.forEach(tab => {
        tab.addEventListener('click', () => {
             driverTabs.forEach(t => {
                 t.classList.remove('active');
                 t.classList.remove('red-glow');
                 t.classList.add('glow-dim');
             });
             tab.classList.remove('glow-dim');
             tab.classList.add('active');
             tab.classList.add('red-glow');
        });
    });
});
