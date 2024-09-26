import { Page, FileUpload } from '../../../components';
import { ParserType } from '../../../../enums';

const Certifications = () => {
  return (
    <Page title="Certifications">
      <div>Certifications</div>
      <FileUpload parserType={ParserType.Certifications} />
    </Page>
  );
};

export default Certifications;
