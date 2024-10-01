import { Page, FileManager } from '../../../components';
import { ParserType } from '../../../../enums';

const Certifications = () => {
  return (
    <Page title="Certifications">
      <FileManager parserType={ParserType.Certifications} />
    </Page>
  );
};

export default Certifications;
