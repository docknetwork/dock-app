import React from 'react';
import {
  Footer,
  FooterTab,
  Button,
  Text,
  Container,
  Content,
  Icon,
} from 'native-base';
import {Routes} from '../core/routes';
import {navigate} from '../core/navigation';
import {Colors} from '../theme/colors';
import styled from 'styled-components/native';

const TabText = styled(Text)`
  color: ${({active}) => (active ? '#000' : '#013c73')}
  fontSize: 14px
  fontWeight: ${({active}) => (active ? 'bold' : 'normal')}
`;

const tabs = [
  {
    id: Routes.APP_TRENDING_STOCKS,
    title: 'Home',
    icon: ({color}) => <Icon name="home-outline" style={{color}} />,
  },
  {
    id: Routes.APP_FAVORITES,
    title: 'Favorites',
    icon: ({color}) => <Icon name="star" style={{color}} />,
  },
];

export function AppLayout(props) {
  const activeTab = tabs.find(tab => tab.id === props.route.name);

  const renderTabs = () => {
    return (
      <Footer style={{backgroundColor: Colors.blue}}>
        <FooterTab>
          {tabs.map(tab => {
            const active = tab.id === activeTab.id;
            return (
              <Button
                style={{
                  backgroundColor: Colors.blue,
                }}
                icon
                onPress={() => navigate(tab.id)}>
                <TabText active={active}>{tab.title}</TabText>
                {tab.icon && <tab.icon color={active ? '#000' : '#013c73'} />}
              </Button>
            );
          })}
        </FooterTab>
      </Footer>
    );
  };

  return (
    <Container>
      <Content>{props.children}</Content>
      {activeTab && renderTabs()}
    </Container>
  );
}

export function withAppLayout(WrappedComponent) {
  return function (props) {
    return (
      <AppLayout {...props}>
        <WrappedComponent {...props} />
      </AppLayout>
    );
  };
}
