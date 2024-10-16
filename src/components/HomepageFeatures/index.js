import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Remote Control from Anywhere, on Any Device',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
       Control and monitor everything in your building—lighting, climate, security, and more—from anywhere using iOS, Android, Windows, Mac, Linux, or any device with a browser, ensuring complete flexibility and accessibility.
      </>
    ),
  },
  {
    title: 'Advanced Automation, Simple Setup',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Step into the future with powerful automation systems that offer easy installation and reliable performance, ensuring a hassle-free upgrade to smarter living.
      </>
    ),
  },
  {
    title: 'Open-Source and Future-Proof',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Empower your building with an open-source automation system that’s easy to customize, expand, and upgrade—ensuring long-term flexibility and control over every aspect of your setup.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
