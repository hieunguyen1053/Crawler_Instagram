module.exports = async (page) => {
    return await page.evaluate(() => {
        let foo = document.querySelectorAll('.v1Nh3.kIKUG._bz0w > a');
        foo = [...foo];
        let bar = foo.map(i => i.getAttribute('href'));
        return bar;
    });
}
