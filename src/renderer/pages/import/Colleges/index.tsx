import { ParserType } from '../../../../enums';
import { Page, FileUpload } from '../../../components';

const Colleges = () => {
  return (
    <Page title="Colleges">
      <div>Colleges</div>
      <FileUpload parserType={ParserType.Colleges} />
    </Page>
  );
};

export default Colleges;
