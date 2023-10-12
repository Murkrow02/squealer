import Editor from '../components/Editor';
import ActionButton from "../components/ActionButton";

function NewSqueal() {
    return (
        <body>
            <header style={{position:'fixed', top:'0', zIndex:'1', backgroundColor:'white'}}>
                <nav style={{ width:'100vw', padding: '20px 0', borderBottom: 'solid 2px #aaaaaa'}}>
                    <h1 style={{margin: '0', textAlign:'center'}}>New Squeal</h1>
                </nav>
            </header>
            <Editor day_max="300" week_max="700" month_max="2000" />
        </body>
    );
}

export default NewSqueal;