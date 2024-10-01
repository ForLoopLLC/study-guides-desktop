import { ParserType } from '../../../../enums';
import { Page, FileManager } from '../../../components';

const Colleges = () => {
  return (
    <Page title="Colleges">
      <FileManager parserType={ParserType.Colleges} />
    </Page>
  );
};

export default Colleges;
