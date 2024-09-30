import { Page, FileUpload } from '../../../components';
import { ParserType } from '../../../../enums';

const Certifications = () => {
  return (
    <Page title="Certifications">
      <FileUpload parserType={ParserType.Certifications} />
    </Page>
  );
};

export default Certifications;
