
export function formComp({state = null, component = null, placeholder = null}) {
    return `
        <form action="/" method="post">
            <input type="text" name="fname" placeholder="Name"/><br />
            <input type="number" name="age" placeholder="Age"/><br />
            <div>
                <label for="upload-photo" style="width: 100%">Upload a photo:</label>
            </div>
            <input type="file" name="photo" id="upload-photo"/><br />
            <button>Save</button>
        </form>
    `;
}
