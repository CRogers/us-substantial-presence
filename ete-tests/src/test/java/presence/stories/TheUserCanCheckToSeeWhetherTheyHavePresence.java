package presence.stories;

import com.palantir.docker.compose.DockerComposeRule;
import com.palantir.docker.compose.configuration.ShutdownStrategy;
import com.palantir.docker.compose.connection.waiting.HealthChecks;
import net.serenitybdd.junit.runners.SerenityRunner;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.thucydides.core.annotations.Managed;
import net.thucydides.core.annotations.Steps;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;
import presence.pages.PresenceTest;
import presence.tasks.EnterTravelHistoryWithPresence;
import presence.tasks.EnterTravelHistoryWithoutPresence;
import presence.tasks.OpenPage;

import static net.serenitybdd.screenplay.EventualConsequence.eventually;
import static net.serenitybdd.screenplay.GivenWhenThen.givenThat;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.GivenWhenThen.then;
import static org.hamcrest.Matchers.is;
import static presence.pages.SubstantialPresence.DOES_NOT_HAVE_PRESENCE;
import static presence.pages.SubstantialPresence.HAS_PRESENCE;

@RunWith(SerenityRunner.class)
public class TheUserCanCheckToSeeWhetherTheyHavePresence {
    private final Actor callum = Actor.named("callum");

    @ClassRule
    public static DockerComposeRule composition = DockerComposeRule.builder()
        .file("docker-compose.yml")
        .waitingForService("selenium", HealthChecks.toRespondOverHttp(4444,
            port -> port.inFormat("http://$HOST:$EXTERNAL_PORT/wd/hub")))
        .shutdownStrategy(ShutdownStrategy.AGGRESSIVE)
        .build();

    @Managed(uniqueSession = true)
    public WebDriver callumsBrowser;

    @Before
    public void callumCanBrowseTheWeb() {
        callum.can(BrowseTheWeb.with(callumsBrowser));
    }

    @Steps private OpenPage openPage;
    @Steps private EnterTravelHistoryWithPresence enterTravelHistoryWithPresence;
    @Steps private EnterTravelHistoryWithoutPresence enterTravelHistoryWithoutPresence;

    @Test
    public void enter_travel_history_and_see_that_they_do_not_have_substantial_presence() {
        givenThat(callum).wasAbleTo(openPage);
        givenThat(callum).wasAbleTo(enterTravelHistoryWithPresence);

        then(callum).should(eventually(seeThat(
            PresenceTest.result(), is(HAS_PRESENCE)
        )));
    }

    @Test
    public void enter_travel_history_and_see_that_they_do_have_substantial_presence() {
        givenThat(callum).wasAbleTo(openPage);
        givenThat(callum).wasAbleTo(enterTravelHistoryWithoutPresence);

        then(callum).should(eventually(seeThat(
            PresenceTest.result(), is(DOES_NOT_HAVE_PRESENCE)
        )));
    }
}
