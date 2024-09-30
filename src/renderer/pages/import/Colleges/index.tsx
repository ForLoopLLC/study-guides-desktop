import { ParserType } from '../../../../enums';
import { Page, FileUpload } from '../../../components';

const Colleges = () => {
  return (
    <Page title="Colleges">
      <FileUpload parserType={ParserType.Colleges} />
    </Page>
  );
};

export default Colleges;
