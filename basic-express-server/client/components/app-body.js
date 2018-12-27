
export function documentBodyComp({ state = null, component = null, placeholder = null }) {
    return `
        <body>
            ${{ component }.component}
        </body>
    `
}
